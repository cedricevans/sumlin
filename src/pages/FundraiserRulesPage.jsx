import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { AlertTriangle, ExternalLink, ShieldCheck } from 'lucide-react';
import { fundraiserRules } from '@/lib/sumlinData';

const FundraiserRulesPage = () => {
	return (
		<>
			<Helmet>
				<title>Fundraiser Disclaimer and Rules | Sumlin Family</title>
				<meta
					name="description"
					content="Review the Sumlin Family Reunion fundraiser disclaimer, payment guidance, and entry rules."
				/>
			</Helmet>

			<section className="section-spacing bg-background pt-24 md:pt-32">
				<div className="container-custom max-w-5xl">
					<div className="text-center mb-12">
						<div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-2 text-sm font-semibold text-primary mb-5">
							<ShieldCheck className="h-4 w-4" />
							Family fundraiser operations page
						</div>
						<h1 className="text-4xl md:text-6xl font-bold mb-4">{fundraiserRules.title}</h1>
						<p className="text-lg text-muted-foreground max-w-3xl mx-auto">
							This page gives the family a public-facing disclaimer and operational ruleset for reunion
							fundraising, peer-payment collection, and manual ticket administration.
						</p>
						<p className="text-sm text-muted-foreground mt-4">Last updated {fundraiserRules.lastUpdated}</p>
					</div>

					<div className="bg-destructive/10 border border-destructive/25 rounded-2xl p-6 mb-10">
						<div className="flex items-start gap-4">
							<AlertTriangle className="h-6 w-6 text-destructive flex-shrink-0 mt-0.5" />
							<div>
								<h2 className="text-xl font-semibold mb-2">Important note</h2>
								<p className="text-muted-foreground leading-relaxed">
									Adding disclaimer language helps the site communicate the intended structure, but it does not
									replace legal review. Keep entries, donations, and any ticket issuance records in the admin
									panel and confirm the final Ohio-facing structure before taking live payments at scale.
								</p>
							</div>
						</div>
					</div>

					<div className="grid gap-6">
						{fundraiserRules.sections.map((section) => (
							<div key={section.title} className="bg-card border border-border/50 rounded-2xl p-8 shadow-sm">
								<h2 className="text-2xl font-bold mb-5">{section.title}</h2>
								<ul className="space-y-4 text-muted-foreground leading-relaxed">
									{section.items.map((item) => (
										<li key={item} className="flex items-start gap-3">
											<span className="mt-2 h-2.5 w-2.5 rounded-full bg-primary flex-shrink-0" />
											<span>{item}</span>
										</li>
									))}
								</ul>
							</div>
						))}
					</div>

					<div className="grid md:grid-cols-2 gap-6 mt-10">
						<div className="bg-muted rounded-2xl p-8 border border-border/50">
							<h2 className="text-2xl font-bold mb-3">Recommended operational setup</h2>
							<p className="text-muted-foreground mb-5 leading-relaxed">
								Create a pending order first, confirm payment or free entry in the admin dashboard, then issue
								the ticket numbers from the same system so the drawing pool is auditable.
							</p>
							<Link
								to="/admin"
								className="inline-flex items-center gap-2 gradient-burgundy text-white px-6 py-3 rounded-xl font-semibold hover:shadow-burgundy transition-all duration-200"
							>
								Open admin dashboard
								<ExternalLink className="h-4 w-4" />
							</Link>
						</div>

						<div className="bg-card rounded-2xl p-8 border border-border/50 shadow-sm">
							<h2 className="text-2xl font-bold mb-3">Family business extension</h2>
							<p className="text-muted-foreground mb-5 leading-relaxed">
								The same tenant can manage reunion support, birthday events, hospitality coordination, and
								Google Calendar-linked planning pages from one place.
							</p>
							<Link
								to="/family-business"
								className="inline-flex items-center gap-2 gradient-gold text-foreground px-6 py-3 rounded-xl font-semibold hover:shadow-gold transition-all duration-200"
							>
								See family business page
								<ExternalLink className="h-4 w-4" />
							</Link>
						</div>
					</div>
				</div>
			</section>
		</>
	);
};

export default FundraiserRulesPage;
