var pkg = require('./package.json'),
    path = require('path'),
    gulp = require('gulp'),
    fs = require('fs'),
    tap = require('gulp-tap'),
    template = [tab(1) + '<template name="{name}"',
        tab(3) + 'value="{snippet}"',
        tab(3) + 'description="{description}" toReformat="false">',
        '{variables}',
        tab(2) + '<context>',
        '{context}',
        tab(2) + '</context>',
        tab(1) + "</template>"].join("\n"),
    defaultContext = [
        tab(3) + '<option name="HTML_TEXT" value="true"/>',
        tab(3) + '<option name="HTML" value="true"/>',
        tab(3) + '<option name="PHP" value="true"/>',
        tab(3) + '<option name="GSP" value="true"/>',
        tab(3) + '<option name="JSP" value="true"/>'].join("\n"),
    xmlTemplate = ['<?xml version="1.0" encoding="UTF-8"?>',
        '<templateSet group="{group}">',
        '{templates}',
        '</templateSet>'].join("\n");

gulp.task('default', ['code-snippets', 'icons', 'custom'], function (done) {
    done();
});

function tab(nr) {
    var tabs = [
        '    ',
        '        ',
        '            ',
    ]; //okay, this is silly
    return tabs[nr - 1];
}

function htmlentities(str) {
    return str.replace(/[\u00A0-\u9999<>\&]/gim, function (i) {
        return '&#' + i.charCodeAt(0) + ';';
    });

}

gulp.task('code-snippets', function (done) {

    var templates = [], docLines = [];

    gulp.src("bower_components/uikit/**/*.less").pipe(tap(function (file) {

        var less = file.contents.toString(),
            regex = /\/\/\s*<!--\s*(.+)\s*-->\s*\n((\/\/.+\n)+)/g,
            match = null,
            name, content, description, variables, snippet, variablesString, cl, co;

        while (match = regex.exec(less)) {

            name = match[1].trim(); // i.e. uk-grid + trim
            content = match[2].replace(/(\n?)(\s*)\/\/ ?/g, '$1$2'); // remove comment slashes from lines
            description = ["UIkit", name, "component"].join(" ");

            // place tab indices
            cl = 0;
            co = 0;
            variables = [];

            content = content.replace(/class="([^"]+)"/g, function (match, className) {
                cl += 1;
                variables.push({
                    'name': 'class' + cl,
                    'expression': "&quot;" + className + "&quot;",
                    'defaultValue': "",
                    'alwaysStopAt': "true"
                });
                return 'class="$class' + cl + '$"';
            }).replace(/(<[^>]+>)(<\/[^>]+>)/g, function (match, open, close) {
                co += 1;
                variables.push({
                    'name': 'content' + co,
                    'expression': "",
                    'defaultValue': "",
                    'alwaysStopAt': "true"
                });
                return open + '$content' + co + '$' + close;
            });

            //make xml safe
            content = htmlentities(content).replace(/"/g, '&quot;').replace(/\n/g, '&#10;'); //todo replace tabs?

            variablesString = variables.map(function (variable) {
                return tab(2) + '<variable name="' + variable.name + '" expression="' + variable.expression
                    + '" defaultValue="' + variable.defaultValue + '" alwaysStopAt="' + variable.alwaysStopAt + '"/>';
            }).join("\n");

            templates.push(template.replace("{name}", name)
                    .replace("{variables}", variablesString)
                    .replace("{description}", description)
                    .replace("{context}", defaultContext)
                    .replace("{snippet}", function () {
                        return content;
                    }) //prevent replacing $&
            );
            docLines.push([name, description].join(' | '));

            // move to next match in loop
            regex.lastIndex = match.index + 1;
        }

        fs.writeFile('resources/liveTemplates/Uikit.xml', xmlTemplate.replace('{group}', 'Uikit')
                .replace('{templates}', function () {
                    return templates.join("\n");
                })
        );

        fs.writeFile('assets/snippetlist-core.md',
                ['# UIkit core snippets', '', 'Name | Description', '-----|-----',
                    docLines.join("\n"), '', '[<<< Back to README](' + pkg.homepage + ')'].join("\n")
        );

    }));


    done();

});

gulp.task('icons', function (done) {

    var templates = [], docLines = [];

    gulp.src("bower_components/uikit/less/core/icon.less").pipe(tap(function(file) {

        var less = file.contents.toString(),
            regex = /uk-icon-(.+):before/g,
            match = null,
            name, content, description, snippet, variablesString, cl, co;

        while (match = regex.exec(less)) {

            name = 'uk-icon-' + match[1].trim();
            content = '<i class="' + name + '"></i>';
            description = ["UIkit", match[1].trim(), "icon"].join(" ");

            //make xml safe
            content = htmlentities(content).replace(/"/g, '&quot;').replace(/\n/g, '&#10;');

            templates.push(template.replace("{name}", name)
                    .replace("{variables}", '')
                    .replace("{context}", defaultContext)
                    .replace("{description}", description)
                    .replace("{snippet}", function () {
                        return content;
                    }) //prevent replacing $&
            );
            docLines.push([name, description].join(' | '));

            // move to next match in loop
            regex.lastIndex = match.index + 1;
        }

        fs.writeFile('resources/liveTemplates/Uikit-icons.xml', xmlTemplate.replace('{group}', 'Uikit-icons')
                .replace('{templates}', function () {
                    return templates.join("\n");
                })
        );

        fs.writeFile('assets/snippetlist-icons.md',
                ['# UIkit icons snippets', '', 'Name | Description', '-----|-----', docLines.join("\n"),
                    docLines.join("\n"), '', '[<<< Back to README](' + pkg.homepage + ')'].join("\n")
        );

    }));

    done();

});

gulp.task('custom', function (done) {

    var templates = [], docLines = [];

    gulp.src("custom/*.html").pipe(tap(function(file) {

        if (path.basename(file.path) === 'empty.html') {
            return;
        }

        file.contents.toString().replace(/\*\*\*\*$/,'').split('****').forEach(function (snippet) {

            var variablesString, parts = snippet.split('===='),
                meta = JSON.parse(parts[1]),
                name = meta.name,
                description = meta.description,
                content = parts[0],
                context = meta.context.map(function (cntxt) {
                        return tab(3) + '<option name="' + cntxt + '" value="true"/>';
                    }).join("\n");

                //make xml safe
                content = htmlentities(content).replace(/"/g, '&quot;').replace(/\n/g, '&#10;');

                variablesString = meta.variables.map(function (variable) {
                    return tab(2) + '<variable name="' + variable.name + '" expression="' + variable.expression.replace(/'/g, '&quot;')
                        + '" defaultValue="' + variable.defaultValue + '" alwaysStopAt="' + variable.alwaysStopAt + '"/>';
                }).join("\n");

                templates.push(template.replace("{name}", name)
                        .replace("{variables}", variablesString)
                        .replace("{context}", context)
                        .replace("{description}", description)
                        .replace("{snippet}", function () {
                            return content;
                        }) //prevent replacing $&
                );
                docLines.push([name, description].join(' | '));

        });

        fs.writeFile('resources/liveTemplates/Uikit-custom.xml', xmlTemplate.replace('{group}', 'Uikit-custom')
                .replace('{templates}', function () {
                    return templates.join("\n");
                })
        );

        fs.writeFile('assets/snippetlist-custom.md',
                ['# UIkit custom snippets', '', 'Name | Description', '-----|-----', docLines.join("\n"),
                        docLines.join("\n"), '', '[<<< Back to README](' + pkg.homepage + ')'].join("\n")
        );

    }));

    done();

});
