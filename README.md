#PHPstorm UIkit Live template plugin

This plugin provides autocomplete live templates of the [UIkit framework](http://getuikit.com) for IntelliJ IDE products.

The basic snippets are taken from the examples in the less source of UIkit.

##Installation

To install in PHPstorm or simular IntelliJ IDE:

* Go to `Settings -> Plugins`
* Click `Browse repositories...`
* Search for `UIkit`
* Install and restart
* Use `Ctrl-J` in PHP storm to envoke the templates

##Developers

To build the plugins jar-file, you need the [IntelliJ IDEA Community Edition](https://www.jetbrains.com/idea/) and the 
source of it. See (http://www.jetbrains.org/display/IJOS/Writing+Plug-ins) for setting up the IDE and SDKs.
Then clone or copy this repository to your local folder and use NPM and Bower to set the project up.

```
npm install
bower install
gulp
```

The Gulp task scans the UIkit Less files and extracts the examples. They are compiled in the `resources/liveTemplates/Uikit.xml` file.
Then use the `Prepare Plugin Module 'UIkit' For Deployment` in the `Build` menu of IntelliJ IDEA to prepare the `UIkit.jar` file.

### License

PHPstorm UIkit Live template plugin is open-sourced software licensed under the [MIT license](http://opensource.org/licenses/MIT).

###Credits
Many thanks to [UIkit](http://getuikit.com) for existing, [@JasonMortonNZ](https://github.com/JasonMortonNZ/bootstrap3-phpstorm-plugin) 
for the plugin base and [@florianletsch](https://github.com/florianletsch) for the less-scraping script he made for the 
[UIkit Sublime Plugin](https://github.com/uikit/uikit-sublime)