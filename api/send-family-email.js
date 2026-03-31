import { buildFamilyCommunicationEmail, getAuthorizedAdminData, sendResendEmail } from './_email.js';

export default async function handler(req, res) {
	if (req.method !== 'POST') {
		res.status(405).json({ ok: false, message: 'Method not allowed' });
		return;
	}

	try {
		const { slug = 'sumlin', ...payload } = req.body || {};
		const adminData = await getAuthorizedAdminData(req.headers.authorization, slug);

		const emailPayload = buildFamilyCommunicationEmail({
			...payload,
			replyTo: payload.replyTo || adminData.tenant?.support_email,
		});

		if (!emailPayload.to.length) {
			res.status(400).json({ ok: false, message: 'Add at least one recipient email address.' });
			return;
		}

		const result = await sendResendEmail(emailPayload);

		res.status(200).json({
			ok: true,
			message: `Email sent to ${emailPayload.to.length} recipient${emailPayload.to.length === 1 ? '' : 's'}.`,
			emailId: result?.id || null,
		});
	} catch (error) {
		console.error('send-family-email error', error);
		res.status(500).json({
			ok: false,
			message: error.message || 'Unable to send the email right now.',
		});
	}
}
