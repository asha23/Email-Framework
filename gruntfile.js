module.exports = function(grunt) {

	require('time-grunt')(grunt);

  // REPLACE THE JOB NUMBER BELOW FOR EACH NEW EMAIL
  grunt.option('jobnumber', 'ILL15_Q2_07');

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

        // Takes your scss files and compiles them to css
        sass: {
          dist: {
            options: {
              style: 'expanded'
            },
            files: {
              'build/css/style.css': 'src/css/style.scss',
            }
          }
        },

        // Assembles your email content with html layout
        assemble: {
          options: {
            layoutdir: 'src/emails/layouts',
            flatten: true,
            helpers: ['handlebars-helper-include', 'src/content/*.html'],
            includes: ['src/content/*.html'],
            partials: ['src/emails/partials/*.hbs'],
          },
          pages: {
            src: ['src/emails/*.hbs'],
            dest: 'build/emails/'
          }
        },

        copy: {
          img: {
            files: [
              { cwd: "src/img/", src: ['**'], dest: 'deploy/img/', expand: true }
            ]
          }
        },

        clean: {
         build: [".sass-cache", "build", "deploy"],
       },

        // Inlines your css
        premailer: {
          html: {
            options: {
              removeComments: true,
              verbose:false,
              warnLevel:'none'
            },
            files: [{
              expand: true,
              src: ['build/emails/*.html'],
              dest: ''
            }]
          },
          txt: {
            options: {
              mode: 'txt',
              warnLevel:'none'
            },
            files: [{
              expand: true,
              src: ['build/emails/*.html'],
              dest: '',
              ext: '.txt'
            }]
          }
        },

        // Watches for changes to css or email templates then runs grunt tasks
        watch: {
          files: ['src/content/*','src/css/*','src/emails/*','src/layouts/*'],
          tasks: ['default']
        },

        // Use Mailgun option if you want to email the design to your inbox or to something like Litmus
        // grunt send --template=transaction.html

        mailgun: {
          mailer: {
            options: {
              key: 'key-b7e79b06c66e3762e7ed2dd4cd996d79', // Enter your Mailgun API key here
              sender: 'ash_whiting@hotmail.com', // Change this
              recipient: 'as ', // Change this
              subject: 'This is a test email'
            },
            src: ['output/'+grunt.option('template')]
          }
        },

        // Use Rackspace Cloud Files if you're using images in your email
        cloudfiles: {
          prod: {
            'user': 'akaconnect', // Change this
            'key': 'd630efa6e9a76f8396026617669a7b6d', // Change this
            'region': 'LON', // Might need to change this
            'upload': [{
              'container': 'emails', // Change this
              'src': 'src/img/*',
              'dest': '/' + grunt.option('jobnumber') + '/',
              'stripcomponents': 1
            }]
          }
        },

        // CDN will replace local paths with your Cloud CDN path
        cdn: {
          options: {
            cdn: 'http://58c09504bd4d501d8121-7ff0c7a787865fc45221cfc6b0877cb6.r30.cf3.rackcdn.com/' + grunt.option('jobnumber') + '/', // Change this
            flatten: true,
            supportedTypes: 'html'
          },
          dist: {
            cwd: './build/emails/',
            dest: './deploy/',
            src: ['*.html']
          }
        },

        // Send your email template to Litmus for testing
        // grunt litmus --template=transaction.html
        litmus: {
          test: {
            src: ['output/'+grunt.option('template')],
            options: {
              username: 'username', // Change this
              password: 'password', // Change this
              url: 'https://yourcompany.litmus.com', // Change this
              clients: ['android4', 'aolonline', 'androidgmailapp', 'aolonline', 'ffaolonline',
              'chromeaolonline', 'appmail6', 'iphone6', 'ipadmini', 'ipad', 'chromegmailnew',
              'iphone6plus', 'notes85', 'ol2002', 'ol2003', 'ol2007', 'ol2010', 'ol2011',
              'ol2013', 'outlookcom', 'chromeoutlookcom', 'chromeyahoo', 'windowsphone8'] // https://#{company}.litmus.com/emails/clients.xml
            }
          }
        }

      });

    // Where we tell Grunt we plan to use this plug-in.
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('assemble');
    grunt.loadNpmTasks('grunt-mailgun');
    grunt.loadNpmTasks('grunt-premailer');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-cloudfiles');
    grunt.loadNpmTasks('grunt-cdn');
    grunt.loadNpmTasks('grunt-litmus');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');

    // Where we tell Grunt what to do when we type "grunt" into the terminal.
    //grunt.registerTask('default', ['sass','assemble','premailer', 'cdn', 'copy']);
    grunt.registerTask('default', ['sass', 'assemble', 'premailer', 'cdn', 'copy']);

    // Use grunt send if you want to actually send the email to your inbox
    grunt.registerTask('send', ['mailgun']);

    // Upload images to our CDN on Rackspace Cloud Files
    grunt.registerTask('upload', ['default', 'cloudfiles']);


  };
