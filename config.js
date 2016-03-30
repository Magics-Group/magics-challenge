module.exports = {
  // Whether the invite automator is running, set to false to disable registrations 
  // and change the homepage back to default
  enabled: false,

  // Tour community or team name to display on join page.
  community: '',

  // Your slack team url (ex: socketio.slack.com)
  slackUrl: '',

  // Access token for your slack group. you can generate at https://api.slack.com/docs/oauth-test-tokens
  // You should generate the token in admin user, not owner.
  // If you generate the token in owner user, missing_scope error will be occurred.
  slackToken: 'SLACK-ACCESS-TOKEN', // 'xxxxx'

  // If you have a bot in your chat, you can use this along with CHANNEL so that the bot will post
  //  a message whenever someone gets invited to your channel.
  // This doesn't have to be a bots token, you can use your own token if you wish to post as yourself.
  botToken: null, // 'xxxxx'

  // Channel ID to post the messages of invites too.
  channel: null, // 'xxxxx'

  // Optional token (password) that must be entered in order for people to get invited
  inviteToken: null, // 'xxxxx'

  // Auto disable registrations after sucessful invite
  disableAfterInvite: false,

  // Subheading (message) displayed while enabled == false;
  disabledMessage: 'Registrations are currently closed'
};
