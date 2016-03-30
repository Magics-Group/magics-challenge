var express = require('express');
var router = express.Router();
var request = require('request');
var config = require('../config');

router.get('*', function(req, res) {
  res.render('index', { community: config.community,
                        tokenRequired: !!config.inviteToken,
                        enabled: config.enabled,
                        disabledMessage: config.disabledMessage });
});

router.post('/invite', function(req, res) {
  if (config.enabled && req.body.email && (!config.inviteToken || (!!config.inviteToken && req.body.token === config.inviteToken))) {
    request.post({
        url: 'https://'+ config.slackUrl + '/api/users.admin.invite',
        form: {
          email: req.body.email,
          token: config.slackToken,
          set_active: true
        }
      }, function(err, httpResponse, body) {
        // body looks like:
        //   {"ok":true}
        //       or
        //   {"ok":false,"error":"already_invited"}
        if (err) { return res.send('Error:' + err); }
        body = JSON.parse(body);
        if (body.ok) {
          res.render('result', {
            message: 'Success! Welcome to ' + config.community,
            subHeading: 'Check your email to complete registration'    
          });
          if (config.channel && (config.botToken || config.slackToken)) {
            request.post({
              url: 'https://' + config.slackUrl + '/api/chat.postMessage',
              form: {
                text: 'Magics: ' + req.body.email + ' has just entered the valid token: *' + req.body.token + '*',
                channel: config.channel,
                token: config.botToken || config.slackToken,
                as_user: true
              }
            });
          }
          if (config.disableAfterInvite) {
            config.enabled = false;
          }
        } else {
          var error = body.error;
          if (error === 'already_in_team') {
            res.render('result', {
              message: 'Success! You are already in ' + config.community,
              subHeading: '<a href="https://'+ config.slackUrl +'">Go to the chat now</a>'   
            });
            return;
          } else if (error === 'already_invited') {
            // If you have lost email, you're fucked, we can't resend   
            res.render('result', {
              message: 'Success! You are already invited to join ' + config.community,
              subHeading: 'Check your email to complete registration'
            });
            return;
          } else if (error === 'invalid_email') {
            error = 'You have entered an invalid email';
          } else if (error === 'invalid_auth') {
            error = 'Something has gone wrong. Please contact a system administrator.';
          }

          res.render('result', {
            community: config.community,
            message: 'Failed! ' + error,
            isFailed: true
          });
        }
      });
  } else {
    var errMsg = [];
    var closed = false;
    if (!req.body.email) {
      errMsg.push('Your email is required');
    }

    if (!!config.inviteToken) {
      if (!req.body.token) {
        errMsg.push('You must enter a valid token');
      }

      if (req.body.token && req.body.token !== config.inviteToken) {
        errMsg.push('The token you entered is incorrect');
      }
    }

    if (!config.enabled) {
      errMsg.push('Registrations are currently closed');
      closed = true;
    }

    res.render('result', {
      community: config.community,
      message: 'Failed! ' + errMsg.join(' and ') + '.',
      isFailed: true,
      isClosed: closed
    });
  }
});

module.exports = router;
