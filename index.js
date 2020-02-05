const Slack = require('slack-node');
const moment = require('moment-timezone');
const slack = new Slack();
const slack_url = process.env.SLACK_URL;
let slack_color;
const slack_channel = process.env.SLACK_CHANNEL;
const slack_name = process.env.SLACK_NAME;
const slack_icon = process.env.SLACK_ICON;
slack.setWebhook(slack_url);

function hook(data) {
	return new Promise((resolve, reject) => {
		slack.webhook(
			{
				channel: slack_channel,
				username: slack_name,
				icon_emoji: slack_icon,
				...data
			},
			(err, response) => {
				if (err) reject(false);
				else resolve(true);
			}
		);
	});
}

exports.handler = async (event, context) => {
	// TODO implement
	const result = event.detail;
	const region = event.region;
	const title_link = `https://${region}.console.aws.amazon.com/codesuite/codepipeline/pipelines/${result.pipeline}/view?region=${region}`;
	let slack_color = '#36a64f';
	if (result.state === 'FAILED') slack_color = '#ed6240';

	const slackMessage = {
		attachments: [
			{
				author_name: result.pipeline,
				color: slack_color,
				title: `${result.stage} <${result.state}>`,
				title_link: title_link,
				fields: [
					{
						title: 'Stage Name',
						value: result.stage,
						short: false
					},
					{
						title: 'State',
						value: result.state,
						short: false
					}
				],
				ts: moment(event.time)
					.tz('Asia/Seoul')
					.unix()
			}
		]
	};
	await hook(slackMessage);
	return;
};
