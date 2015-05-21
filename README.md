# PHPstorm UIkit Live template plugin

This plugin provides autocomplete live templates of the [UIkit framework](http://getuikit.com) for IntelliJ IDE products.

The basic snippets are taken from the examples in the less source of UIkit.

## Installation

To install in PHPstorm or simular IntelliJ IDE:

* Go to `Settings -> Plugins`
* Click `Browse repositories...`
* Search for `UIkit`
* Install and restart

![Install plugin](/assets/install_plugin.png)

* Use `Ctrl-J` in PHP storm to envoke the templates. Make sure you are in a html/html_text/php/gsp/jsp code context.

![Use template](/assets/use_template.png)

## Rate the plugin

If you're happy using this plugin, please tell the world at [JetBrains Plugin Repository](https://plugins.jetbrains.com/plugin/7791) 
and comment and rate!

## List of templates

The complete list of snippets can be found in seperate files.  
[Core snippets](/assets/snippetlist-core.md)  
[Icons snippets](/assets/snippetlist-icons.md)  
[Custom snippets](/assets/snippetlist-custom.md)

## Contributing

You can contribute by creating your own custom snippets. Add a file to the `/custom` folder according to the format of 
[`/custom/empty.html`](https://github.com/Bixie/intellij-uikit/blob/master/custom/empty.html). You can put multiple snippets in
one file.

## Developers

*The following information explains how this plugin is maintained. Users do not need to care about those steps.*

To build the plugins installable `UIkit.jar` file, you need the [IntelliJ IDEA Community Edition](https://www.jetbrains.com/idea/) and the 
source of it. See (http://www.jetbrains.org/display/IJOS/Writing+Plug-ins) for setting up the IDE and SDKs.
Then clone or copy this repository to your local folder and use NPM and Bower to set the project up.

```
npm install
bower install
gulp
```

The Gulp task scans the UIkit Less files and extracts the examples. They are compiled to the `resources/liveTemplates/Uikit*.xml` files and snippetlists.
Then use the `Prepare Plugin Module 'UIkit' For Deployment` in the `Build` menu of IntelliJ IDEA to prepare the `UIkit.jar` file.

### License

PHPstorm UIkit Live template plugin is open-sourced software licensed under the [MIT license](http://opensource.org/licenses/MIT).

### Credits
Many thanks to [UIkit](http://getuikit.com) for existing, [@JasonMortonNZ](https://github.com/JasonMortonNZ/bootstrap3-phpstorm-plugin) 
for the plugin base and [@florianletsch](https://github.com/florianletsch) for the less-scraping script he made for the 
[UIkit Sublime Plugin](https://github.com/uikit/uikit-sublime)