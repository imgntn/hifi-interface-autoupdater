var exec = require('child_process').exec;

var fs = require('fs'),
    xml2js = require('xml2js');


var request = require('request');


var jsonfile = require('jsonfile')


//read last version
//get xml 
//parse xml for current version number
//if current version is greater than last version
//write to last version
//download interface
//quit interface
//attach dmg
//copy to applications
//detach dmg
//delete dmg

var dmgName = 'interface.dmg';

var lastVersion = require('./lastVersion.json').last

var currentVersion;



function requestBuildsXML(callback) {

    request('https://highfidelity.com/builds.xml', function(error, response, body) {
        if (!error && response.statusCode == 200) {
            fs.writeFile('builds.xml', body, function(err) {
                if (err) return console.log(err);
                parseXMLForVersion()

            });
        }
    });



}


function parseXMLForVersion() {

    var parser = new xml2js.Parser();
    parser.addListener('end', function(result) {
        var project = result.projects.project[0];

        //platform 0 is win, platform 1 is mac
        var build = project.platform[1].build;

        var version = build[0].version[0];
        currentVersion = version;
        console.log('CURRENT?', currentVersion)

        compareVersions();

    });
    fs.readFile(__dirname + '/builds.xml', function(err, data) {
        parser.parseString(data);
    });



}


function compareVersions() {
    console.log('CURRENT /  LAST' + currentVersion + " / " + lastVersion)
    if (currentVersion > lastVersion) {
        console.log('THERE IS AN UPDATE, CONTINUE')

        writeToLastVersion();
        requestInterface();
    } else {
        console.log('NO UPDATE YET')
        return
    }
}



function writeToLastVersion() {
    var file = './lastVersion.json'
    var obj = {
        last: currentVersion
    }
    lastVersion = currentVersion;
    jsonfile.writeFile(file, obj, function(err) {
        if (err) {
            console.error(err)
        }

    })

}



function requestInterface() {
    console.log('downloading interface...')

    var r = request('https://highfidelity.com/download/mac/' + currentVersion).pipe(fs.createWriteStream('interface.dmg'))
    r.on('finish', function() {
        console.log('FINISHED DOWNLOADING!')
        quitInterface();
        mountDisk();
    })
}



function quitInterface() {
    var quitString = "osascript -e 'quit app \"Interface\"'"

    var child = exec(quitString,
        function(error, stdout, stderr) {

            if (error !== null) {
                console.log('exec error: ' + error);
            }
        });

}


function openInterface() {
    var openString ='open "/Applications/interface.app/"'

    var child = exec(openString,
        function(error, stdout, stderr) {

            if (error !== null) {
                console.log('exec error: ' + error);
            }
        });

}


function mountDisk() {
    var child = exec('hdiutil attach ' + dmgName,
        function(error, stdout, stderr) {

            if (error !== null) {
                console.log('exec error: ' + error);
            }

            copyToApplications();


        });

}


function copyToApplications() {
    var volumePath = '"/Volumes/Interface Mac Build: ' + currentVersion + '"';
    var child = exec('cd ' + volumePath + ' && ls && cp -r interface.app/ /Applications/Interface.app ',
        function(error, stdout, stderr) {

            if (error !== null) {
                console.log('exec error: ' + error);
            }

            detachDisk();
        });

}

function detachDisk() {
    var volumePath = '"/Volumes/Interface Mac Build: ' + currentVersion + '"';
    var child = exec('hdiutil detach ' + volumePath,
        function(error, stdout, stderr) {

            if (error !== null) {
                console.log('exec error: ' + error);
            }

            deleteDisk();
        });


}

function deleteDisk() {
    var child = exec('rm ' + dmgName,
        function(error, stdout, stderr) {
            console.log('done with cleanup for this check')
            if (error !== null) {
                console.log('exec error: ' + error);
            }
        });
    openInterface();

}



function start() {
    requestBuildsXML();
}

var intervalMinutes = 30;
var intervalLength = 60 * intervalMinutes * 1000;

setInterval(function() {
    console.log('check on interval')
    start();
}, intervalLength);

console.log('initial check')
start();