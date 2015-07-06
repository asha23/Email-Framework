# Dynamic Email Design Workflow

Designing and testing emails can be a tedious, repetitive, hell. HTML tables, inline CSS, various devices and clients to test, and varying support for the latest web standards.

This Grunt task/methodology attempts to help simplify things at the design stage by allowing you to utilise modern frontend techniques and leverage a Static Site Generator, [Assemble](http://assemble.io/). This process should make it easier to construct email templates quickly and simply.

## What it does

1. Compiles your SCSS to CSS

2. Builds your HTML and TXT email templates

3. Inlines your CSS automatically, so you can use conventional SCSS to create styles

4. Uploads any images to a CDN (optional)

5. Sends you a test email to your inbox (optional)

6. Modular, dynamic structuring

7. Templating system using Markdown for content, allowing you the option to keep content separate from layout if need be

8. It's based around the Sassy Ink responsive email framework by Zurb Foundation - There is [documentation here](http://zurb.com/ink/docs.php)

## Requirements

* Node.js - [Install Node.js](https://github.com/joyent/node/wiki/Installing-Node.js-via-package-manager)
* Grunt-cli and Grunt (`npm install grunt-cli -g`)
* Ruby - [Install ruby with RVM](https://rvm.io/rvm/install)
* Premailer (`gem install premailer hpricot nokogiri`) - Inlines the CSS

Optionally:

* [Mailgun](http://www.mailgun.com) (optional) - Sends the email
* [Litmus](https://litmus.com) (optional) - Tests the email across all clients/browsers/devices
* [Rackspace Cloud](http://www.rackspace.com/cloud/files/) (optional) - Uses Cloud Files as a CDN

## Getting started

If you haven't used [Grunt](http://gruntjs.com/) before check out Chris Coyier's post on [getting started with Grunt](http://24ways.org/2013/grunt-is-not-weird-and-hard/).

Fork this repo, cd to the directory, run `sudo npm install` to install the necessary packages. 

## CSS

This project uses [SCSS](http://sass-lang.com/). You don't need to touch the .css files, these are compiled automatically.

For changes to CSS, modify the `.scss` files. These can be found in `src/css/scss/custom`. You shouldn't need to change anything else as the other files are for the core Ink css framework. Most of this can simply be overridden if necessary.

Media queries and responsive styles are in a separate stylesheet so that they don't get inlined. Note that only a few clients support media queries e.g. iOS Mail app.

## Email templates and content

**Handlebars** and **Assemble** are used for templating.

All email code should go into the `src/` directory.

`src/css` contains `style.css`, where custom CSS can be placed. This will be inlined by premailer at the build stage.

`src/emails` contains templates for each email - one .hbs file for each mail to be built.

`src/emails/layouts` contains the standard header/footer HTML markup. You most likely will only need one layout template, but you can have as many as you like.

`src/content` contains Markdown and HTML files which can be included in any templates. This markdown can also contain HTML if Markdown is not enough by itself. Use Markdown files only for main copy and T&Cs as it wraps things in p tags. Use html files for things like the headline, booking number, etc.. The problem with the use of p tags is that it's impossible to get rid of their bottom margin on hotmail/outlook.com web clients.

Markdown files can be added by using the brackets format (the example below would need a copy.md file in the src/content folder):
```
{{md "src/content/copy.md"}}
```
HTML files can be added by using the below brackets format (the example below would need a booking-number.html file in the src/content folder):
```
{{include "booking-number"}}
```
Of course, you can add the content inline if you like.


There is also an `examples` folder, containing an example email template. This template file can be copied to `src/emails` to use as a starting point for new emails.


It's well worth taking a quick look at Markdown. A quick and easy way to generate common HTML functionality, without touching a line of html 
[http://daringfireball.net/projects/markdown/syntax](http://daringfireball.net/projects/markdown/syntax)

For images, you can either upload them somewhere and use their absolute link straight in the hbs file. However, best practice is to use the Rackspace cloud functionality built in. Just update the gruntfile.js to include the right Rackspace User and API Key. When that's done, place your images in src/img and run grunt upload in your terminal (this will only upload images to Rackspace). You can include images as below in your hbs file:
```
<img src="img/test.jpg">
```
The path of all images in the final file in deploy should be replaced to the path of the uploaded images on Rackspace.

### Generate your email templates

In terminal, run `grunt`. This will:

* Compile your SCSS to CSS
* Generate your email layout and content
* Inline your CSS

See the output HTML in the `dist` folder. Open them and preview it the browser.

Alternatively run `grunt watch`. This will check for any changes you make to your .scss and .hbs templates, then automatically run the tasks. Saves you having to run grunt every time.

## Ink Framework Basics

###Grid
Create powerful multi-device layouts quickly and easily.

###Structure
Ink uses a 12-column grid with a 580px wrapper. On mobile devices (under 580px wide), columns become full width and stack vertically.

Ink's grid can be thought of in terms of three components:

###Containers
Ink containers wrap the content and maintain a fixed, 580px layout on large displays. Below 580px, containers take up 95% of the screen's width, ensuring that your content doesn't run right up against the edges of the user's screen.

###Rows
Rows are used to separate blocks of content vertically. In addition to the vertical separation, the `<td>` tags of `.row` tables use the wrapper class to maintain a gutter between columns. Note: the last .wrapper <td> in a row MUST have a class of .last applied to it, even if it's the only wrapper in the row (ex. for a row with a single, twelve-column wide content area).

####Columns
Columns denote the width of the content, as based on a 12-column system. The content inside them will expand to cover n-columns, assuming that the number of columns in one row adds up to 12.

##The Basic Grid Layout
Basic example of the three main grid components.


```
<table class="container">
  <tr>
    <td>

      <table class="row">
        <tr>
          <td class="wrapper">

            <table class="eight columns">
              <tr>
                <td>

                  Eight Columns

                </td>
                <td class="expander"></td>
              </tr>
            </table>

          </td>
          <td class="wrapper last">

            <table class="four columns">
              <tr>
                <td>

                  Four Columns

                </td>
                <td class="expander"></td>
              </tr>
            </table>

          </td>
        </tr>
      </table>

    </td>
  </tr>
</table>
```

For more documentation please refer to the [INK](http://zurb.com/ink/docs.php) framework.
## Send the email to yourself using Mailgun

* Sign up for a [Mailgun](http://www.mailgun.com) account (it's free)
* Open up `Gruntfile.js`
* Replace 'MAILGUN_KEY' with your actual Mailgun API key
* Change the sender and recipient to your own email address (or whoever you want to send it to)

Run `grunt send --template=transaction.html`. This will email out the template you specify.

Change 'transaction.html' to the name of the email template you want to send.