var pkg         = require('./package.json'),
    gulp        = require('gulp'),
    fs          = require('fs'),
    mkdirp      = require('mkdirp'),
    tap         = require('gulp-tap');

gulp.task('default', ['code-snippets'], function(done) {
    console.log('done');
    done();
});

function tab (nr) {
    var tabs = [
        '    ',
        '        ',
        '            ',
    ]; //okay, this is silly
    return tabs[nr - 1];
}

function htmlentities (str) {
    return str.replace(/[\u00A0-\u9999<>\&]/gim, function(i) {
        return '&#'+i.charCodeAt(0)+';';
    });
}

gulp.task('code-snippets',  function(done) {

    var fileTemplate = ['<?xml version="1.0" encoding="UTF-8"?>',
            '<templateSet group="Uikit">',
            '{templates}',
            '</templateSet>'].join("\n"),
        template = [tab(1) + '<template name="{name}"',
            tab(3) + 'value="{snippet}"',
            tab(3) + 'description="{description}" toReformat="false">',
            '{variables}',
            tab(2) + '<context>',
            tab(3) + '<option name="HTML_TEXT" value="true"/>',
            tab(3) + '<option name="HTML" value="true"/>',
            tab(3) + '<option name="PHP" value="true"/>',
            tab(3) + '<option name="GSP" value="true"/>',
            tab(3) + '<option name="JSP" value="true"/>',
            tab(2) + '</context>',
            tab(1) + "</template>"].join("\n"),
        templates = [];

    mkdirp.sync("dist/sublime/snippets");

    gulp.src("bower_components/uikit/**/*.less").pipe(tap(function(file) {

        var less = file.contents.toString(),
            regex = /\/\/\s*<!--\s*(.+)\s*-->\s*\n((\/\/.+\n)+)/g,
            match = null,
            name, content, description, variables, snippet, variablesString, cl, co;

        while (match = regex.exec(less)) {

            name        = match[1].trim(); // i.e. uk-grid + trim
            content     = match[2].replace(/(\n?)(\s*)\/\/ ?/g,'$1$2'); // remove comment slashes from lines
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
                              .replace("{snippet}", function () {return content; }) //prevent replacing $&
                 );

             // move to next match in loop
             regex.lastIndex = match.index + 1;
        }

        fs.writeFile('resources/liveTemplates/Uikit.xml', fileTemplate.replace('{templates}', function () {return templates.join("\n"); }));

    }));

    done();

});
