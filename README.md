# Meetdown.js

Install dependencies:

    $ npm install

Start the mongo daemon (in a new terminal):

    $ sudo mongod

[Register your application with GitHub](https://github.com/settings/applications/new)

    Application Name: your-unique-app-name-here
    Main URL: http://localhost:3000
    Callback URL: http://localhost:3000/auth/github/callback

Create a file named settings_testing.json and save to your node application root
    
    //paste this file and replace id + secret key values from your registered application
    {
        "GITHUB_OAUTH2_ID": "paste-your-id-here",
        "GITHUB_OAUTH2_SECRET": "paste-your-secret-here"
    }

Start the server (in another terminal; [tmux][] anyone?):

    $ node app

Open the Mongo shell (in YAT; tmuxinator?):

    $ mongo

Add a user record:

    > ken = {name: 'ken bolton', created_at: new Date()}
    { "name" : "ken bolton", "created_at" : ISODate("2012-05-16T23:28:23.670Z") }
    > db.users.save(ken)

Add a couple of events:

    > event1 = {title: "Ken's Birthday", starts_at: new Date(2012, 6, 27), description: 'He will be even older'}
    > event2 = {title: 'Pi Day', starts_at: new Date(2013, 2, 14), description: 'Everyone loves Pi'}
    > db.events.save(event1)
    > db.events.save(event2)

Then open the a browser to <http://localhost:3000/user/>

[tmux]: http://tmux.sourceforge.net/ "Many terminals, one window"
