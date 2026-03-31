/* global process */

import { createClient } from '@supabase/supabase-js';

const DEFAULT_SLUG = 'sumlin';
const DEFAULT_SIGNATURE = 'The Sumlin Family Reunion Committee';
const APP_URL = 'https://www.sumlinfamily.com';
const PRIMARY_COLOR = '#7a1024';
const ACCENT_COLOR = '#c79a2b';
const SURFACE_COLOR = '#fffaf3';
const BORDER_COLOR = '#eadfcb';
const TEXT_COLOR = '#1f1f1f';
const MUTED_COLOR = '#675d52';

function escapeHtml(value) {
	return String(value ?? '')
		.replaceAll('&', '&amp;')
		.replaceAll('<', '&lt;')
		.replaceAll('>', '&gt;')
		.replaceAll('"', '&quot;')
		.replaceAll("'", '&#39;');
}

function escapeAttribute(value) {
	return escapeHtml(value);
}

function normalizeEmailList(value) {
	if (!value) {
		return [];
	}

	const list = Array.isArray(value) ? value : String(value).split(/[\n,;]+/);
	return [...new Set(list.map((item) => item.trim().toLowerCase()).filter(Boolean))];
}

function formatCurrency(cents) {
	return new Intl.NumberFormat('en-US', {
		style: 'currency',
		currency: 'USD',
	}).format((Number(cents) || 0) / 100);
}

function buildParagraphs(message) {
	return String(message || '')
		.split(/\n{2,}/)
		.map((part) => part.trim())
		.filter(Boolean);
}

function groupTicketsByRaffle(tickets = []) {
	return tickets.reduce((acc, ticket) => {
		const raffleName = ticket?.raffle_name || 'General';
		const ticketNumber = ticket?.ticket_number ?? ticket?.number;

		if (ticketNumber === undefined || ticketNumber === null) {
			return acc;
		}

		if (!acc[raffleName]) {
			acc[raffleName] = [];
		}

		acc[raffleName].push(ticketNumber);
		return acc;
	}, {});
}

function renderButton(label, url) {
	if (!label || !url) {
		return '';
	}

	return `
		<tr>
			<td style="padding: 8px 0 0;">
				<a href="${escapeAttribute(url)}" style="display: inline-block; padding: 14px 22px; border-radius: 999px; background: ${PRIMARY_COLOR}; color: #ffffff; text-decoration: none; font-weight: 700;">
					${escapeHtml(label)}
				</a>
			</td>
		</tr>
	`;
}

function renderBaseTemplate({ previewText, eyebrow, heading, intro, sections = [], buttonLabel, buttonUrl, closingLines = [], signature = DEFAULT_SIGNATURE }) {
	const hiddenPreview = escapeHtml(previewText || heading || 'Sumlin Family update');
	const renderedSections = sections
		.map((section) => {
			if (section.type === 'facts') {
				return `
					<table role="presentation" width="100%" style="border-collapse: collapse; margin: 0 0 24px;">
						<tbody>
							${section.items.map((item) => `
								<tr>
									<td style="padding: 10px 0; border-bottom: 1px solid ${BORDER_COLOR}; vertical-align: top; width: 38%; color: ${MUTED_COLOR}; font-weight: 600;">${escapeHtml(item.label)}</td>
									<td style="padding: 10px 0; border-bottom: 1px solid ${BORDER_COLOR}; color: ${TEXT_COLOR};">${escapeHtml(item.value)}</td>
								</tr>
							`).join('')}
						</tbody>
					</table>
				`;
			}

			if (section.type === 'ticket-groups') {
				return `
					<div style="margin: 0 0 24px; padding: 20px; border-radius: 18px; background: ${SURFACE_COLOR}; border: 1px solid ${BORDER_COLOR};">
						<p style="margin: 0 0 14px; font-size: 12px; letter-spacing: 0.18em; text-transform: uppercase; color: ${PRIMARY_COLOR}; font-weight: 800;">${escapeHtml(section.title || 'Ticket Numbers')}</p>
						${section.groups.length
							? section.groups.map((group) => `
								<div style="margin: 0 0 12px;">
									<p style="margin: 0 0 4px; font-weight: 700; color: ${TEXT_COLOR};">${escapeHtml(group.label)}</p>
									<p style="margin: 0; color: ${MUTED_COLOR};">${escapeHtml(group.value)}</p>
								</div>
							`).join('')
							: `<p style="margin: 0; color: ${MUTED_COLOR};">Pending assignment</p>`}
					</div>
				`;
			}

			return `
				<p style="margin: 0 0 18px; color: ${MUTED_COLOR}; line-height: 1.7;">
					${escapeHtml(section.content)}
				</p>
			`;
		})
		.join('');

	return `
		<!DOCTYPE html>
		<html lang="en">
			<head>
				<meta charset="utf-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1.0" />
				<title>${escapeHtml(heading)}</title>
			</head>
			<body style="margin: 0; padding: 0; background: #f6efe3; font-family: Georgia, 'Times New Roman', serif; color: ${TEXT_COLOR};">
				<div style="display: none; max-height: 0; overflow: hidden; opacity: 0;">
					${hiddenPreview}
				</div>
				<table role="presentation" width="100%" style="border-collapse: collapse; width: 100%; background: #f6efe3;">
					<tr>
						<td style="padding: 32px 16px;">
							<table role="presentation" width="100%" style="max-width: 680px; margin: 0 auto; border-collapse: collapse; background: #ffffff; border-radius: 28px; overflow: hidden;">
								<tr>
									<td style="padding: 36px 36px 28px; background: linear-gradient(135deg, ${PRIMARY_COLOR} 0%, #351114 100%); color: #ffffff;">
										<p style="margin: 0 0 12px; font-size: 12px; letter-spacing: 0.24em; text-transform: uppercase; font-weight: 800; color: #f3d784;">${escapeHtml(eyebrow)}</p>
										<h1 style="margin: 0 0 12px; font-size: 34px; line-height: 1.15;">${escapeHtml(heading)}</h1>
										<p style="margin: 0; color: rgba(255, 255, 255, 0.82); font-size: 17px; line-height: 1.6;">${escapeHtml(intro)}</p>
									</td>
								</tr>
								<tr>
									<td style="padding: 32px 36px 36px;">
										${renderedSections}
										<table role="presentation" width="100%" style="border-collapse: collapse;">
											<tbody>
												${renderButton(buttonLabel, buttonUrl)}
											</tbody>
										</table>
										${closingLines.map((line) => `
											<p style="margin: 18px 0 0; color: ${MUTED_COLOR}; line-height: 1.7;">
												${escapeHtml(line)}
											</p>
										`).join('')}
										<p style="margin: 26px 0 0; color: ${TEXT_COLOR}; line-height: 1.7;">
											With love,<br />
											<strong>${escapeHtml(signature)}</strong>
										</p>
									</td>
								</tr>
								<tr>
									<td style="padding: 20px 36px 28px; border-top: 1px solid ${BORDER_COLOR}; color: ${MUTED_COLOR}; font-size: 13px; line-height: 1.6;">
										Sumlin Family Reunion
										<br />
										<a href="${APP_URL}" style="color: ${PRIMARY_COLOR}; text-decoration: none;">${APP_URL}</a>
									</td>
								</tr>
							</table>
						</td>
					</tr>
				</table>
			</body>
		</html>
	`;
}

export function buildOrderEmail({ order, tickets = [], tenant, variant = 'payment-confirmed' }) {
	const groupedTickets = Object.entries(groupTicketsByRaffle(tickets)).map(([label, numbers]) => ({
		label,
		value: numbers.map((number) => `#${number}`).join(' · '),
	}));
	const supportEmail = tenant?.support_email || process.env.RESEND_EMAIL || 'contact@sumlinfamily.com';
	const isConfirmed = variant === 'payment-confirmed';
	const subject = isConfirmed
		? `Thank you for your Sumlin Family support, ${order.reference_code || 'payment confirmed'}`
		: `Your Sumlin Family fundraiser entry has been received${order.reference_code ? ` (${order.reference_code})` : ''}`;

	const facts = [
		{ label: 'Reference Code', value: order.reference_code || 'Pending' },
		{ label: 'Amount', value: formatCurrency(order.donation_amount_cents) },
		{ label: 'Entries', value: String(order.entry_count || 0) },
		{ label: 'Payment Method', value: order.payment_method || 'Family fundraiser' },
	];

	const messageLines = isConfirmed
		? [
			`Hi ${order.purchaser_name || 'Family'}, your payment has been confirmed and your fundraiser entries are active.`,
			'Please keep this email for your records.',
			'Drawing and reunion details will be shared with the family as the event gets closer.',
			`If anything looks off, reply to ${supportEmail} so we can help.`,
		]
		: [
			`Hi ${order.purchaser_name || 'Family'}, we saved your fundraiser order and your ticket numbers are reserved.`,
			'Your entries are not fully confirmed until the family receives payment.',
			`When payment is confirmed, we will send you a thank-you email at ${order.email}.`,
			`Questions can be sent to ${supportEmail}.`,
		];

	const html = renderBaseTemplate({
		previewText: isConfirmed ? 'Your payment has been confirmed and your entries are active.' : 'Your order has been received and your entries are reserved.',
		eyebrow: isConfirmed ? 'Payment Confirmed' : 'Order Received',
		heading: isConfirmed ? 'Thank you for supporting the family' : 'Your entry has been received',
		intro: messageLines[0],
		sections: [
			{
				type: 'facts',
				items: facts,
			},
			{
				type: 'ticket-groups',
				title: 'Your Ticket Numbers by Raffle',
				groups: groupedTickets,
			},
			...messageLines.slice(1).map((content) => ({ content })),
		],
		buttonLabel: isConfirmed ? 'View Reunion Site' : 'Complete Payment',
		buttonUrl: isConfirmed ? APP_URL : tenant?.paypal_donate_url || `${APP_URL}/donate`,
		closingLines: [
			isConfirmed ? 'We appreciate every donation, ticket purchase, and family gift.' : 'Thank you for making space in the reunion budget and keeping the family connected.',
		],
	});

	const text = [
		messageLines[0],
		'',
		...facts.map((fact) => `${fact.label}: ${fact.value}`),
		'',
		'Ticket Numbers by Raffle:',
		...(groupedTickets.length ? groupedTickets.map((group) => `${group.label}: ${group.value}`) : ['Pending assignment']),
		'',
		...messageLines.slice(1),
		'',
		'With love,',
		DEFAULT_SIGNATURE,
	].join('\n');

	return {
		subject,
		html,
		text,
		to: normalizeEmailList(order.email),
		replyTo: normalizeEmailList(supportEmail),
	};
}

export function buildFamilyCommunicationEmail(payload = {}) {
	const subject = String(payload.subject || 'Sumlin Family update').trim();
	const heading = String(payload.heading || subject).trim();
	const signature = String(payload.signature || DEFAULT_SIGNATURE).trim();
	const messageParagraphs = buildParagraphs(payload.message);
	const audienceLabel = String(payload.audienceLabel || 'Family update').trim();
	const recipients = normalizeEmailList(payload.recipients);

	const html = renderBaseTemplate({
		previewText: payload.previewText || subject,
		eyebrow: audienceLabel,
		heading,
		intro: messageParagraphs[0] || 'A new family update is ready.',
		sections: messageParagraphs.slice(1).map((content) => ({ content })),
		buttonLabel: payload.ctaLabel,
		buttonUrl: payload.ctaUrl,
		signature,
		closingLines: payload.replyTo ? [`Reply to ${payload.replyTo} if you have questions.`] : [],
	});

	const text = [
		heading,
		'',
		...messageParagraphs,
		payload.ctaLabel && payload.ctaUrl ? `\n${payload.ctaLabel}: ${payload.ctaUrl}` : '',
		'',
		'With love,',
		signature,
	].filter(Boolean).join('\n');

	return {
		subject,
		html,
		text,
		to: recipients,
		replyTo: normalizeEmailList(payload.replyTo),
	};
}

export async function sendResendEmail({ to, subject, html, text, replyTo = [] }) {
	const resendApiKey = process.env.RESEND_API_KEY;
	const fromEmail = process.env.RESEND_EMAIL || process.env.FROM_EMAIL;

	if (!resendApiKey) {
		throw new Error('Missing RESEND_API_KEY env var');
	}

	if (!resendApiKey.startsWith('re_')) {
		throw new Error('Invalid RESEND_API_KEY format. Resend API keys normally start with "re_".');
	}

	if (!fromEmail) {
		throw new Error('Missing RESEND_EMAIL env var');
	}

	const recipients = normalizeEmailList(to);
	if (!recipients.length) {
		throw new Error('No email recipient provided');
	}

	const response = await fetch('https://api.resend.com/emails', {
		method: 'POST',
		headers: {
			Authorization: `Bearer ${resendApiKey}`,
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			from: `Sumlin Family <${fromEmail}>`,
			to: recipients,
			subject,
			html,
			text,
			...(normalizeEmailList(replyTo).length
				? { reply_to: normalizeEmailList(replyTo) }
				: {}),
		}),
	});

	if (!response.ok) {
		const body = await response.text();
		if (response.status === 401) {
			throw new Error('Resend rejected the API key. Update RESEND_API_KEY in your deployment environment and redeploy.');
		}

		throw new Error(`Resend error: ${body}`);
	}

	return response.json();
}

export async function getAuthorizedAdminData(authHeader, slug = DEFAULT_SLUG) {
	const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
	const supabasePublishableKey = process.env.SUPABASE_PUBLISHABLE_KEY || process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

	if (!supabaseUrl || !supabasePublishableKey) {
		throw new Error('Missing Supabase server config');
	}

	if (!authHeader?.startsWith('Bearer ')) {
		throw new Error('Missing admin authorization token');
	}

	const accessToken = authHeader.slice('Bearer '.length).trim();
	if (!accessToken) {
		throw new Error('Missing admin authorization token');
	}

	const supabase = createClient(supabaseUrl, supabasePublishableKey, {
		auth: { persistSession: false },
		global: {
			headers: {
				Authorization: `Bearer ${accessToken}`,
			},
		},
	});

	const { error: userError } = await supabase.auth.getUser(accessToken);
	if (userError) {
		throw new Error(userError.message || 'Invalid admin session');
	}

	const sumlinDb = supabase.schema('sumlin');
	const rpcResult = await sumlinDb.rpc('get_admin_data', { target_slug: slug });

	if (rpcResult.error) {
		throw new Error(rpcResult.error.message);
	}

	const raw = rpcResult.data;
	const result = Array.isArray(raw) ? (raw[0] ?? {}) : (raw ?? {});

	if (!result.ok) {
		throw new Error(result.message || 'Access denied');
	}

	return result;
}
