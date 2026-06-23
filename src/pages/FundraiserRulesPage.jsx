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
										{/* Winners Announcement Section */}
										<div className="text-center mb-12">
											<div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-2 text-sm font-semibold text-primary mb-5">
												<ShieldCheck className="h-4 w-4" />
												Family fundraiser guide
											</div>
											<h1 className="text-4xl md:text-6xl font-bold mb-4">{fundraiserRules.title}</h1>
											<p className="text-lg text-muted-foreground max-w-3xl mx-auto">
												This page shares the public giveaway guidance, entry information, and reunion support notes for the family fundraiser.
											</p>
											<p className="text-sm text-muted-foreground mt-4">Last updated {fundraiserRules.lastUpdated}</p>

											{/* Winners Announcement */}
											<section className="mt-12 bg-white/80 rounded-2xl shadow border border-amber-100 p-6 max-w-2xl mx-auto flex flex-col items-center">
												<img
													src="/winners.png"
													alt="2026 Basket Winners"
													className="w-full max-w-md mb-4 rounded-xl border border-amber-200 shadow"
													style={{ objectFit: 'cover' }}
												/>
												<div className="text-center">
													<h3 className="text-2xl font-bold text-amber-900 mb-2">Congratulations to Our 2026 Basket Winners!</h3>
													<p className="text-stone-700 mb-2">
														Announced May 9, 2026 — Thank you to everyone who participated in the 25-Ticket Challenge and supported our family reunion!
													</p>
													<ul className="mb-4 text-stone-800 font-semibold space-y-2">
														<li>
															<span className="block text-lg text-amber-900 font-bold">Men's BBQ Basket</span>
															<span className="block text-stone-700">Winner: <span className="text-amber-700 font-bold">Vicky Robertson</span></span>
														</li>
														<li>
															<span className="block text-lg text-fuchsia-900 font-bold">Women's Spa Basket</span>
															<span className="block text-stone-700">Winner: <span className="text-fuchsia-700 font-bold">O'Dell Rich Jr.</span></span>
														</li>
														<li>
															<span className="block text-lg text-blue-900 font-bold">Children's Fun Basket</span>
															<span className="block text-stone-700">Winner: <span className="text-blue-700 font-bold">Faye Boyd</span></span>
														</li>
													</ul>
													<p className="text-stone-600 text-sm">
														Stay tuned for more raffles and giveaways throughout the year!
													</p>
												</div>
											</section>
										</div>

					<div className="bg-destructive/10 border border-destructive/25 rounded-2xl p-6 mb-10">
						<div className="flex items-start gap-4">
							<AlertTriangle className="h-6 w-6 text-destructive flex-shrink-0 mt-0.5" />
							<div>
								<h2 className="text-xl font-semibold mb-2">Important note</h2>
								<p className="text-muted-foreground leading-relaxed">
									This page shares helpful family guidance, but it does not replace legal review. Before accepting
									live payments at scale, the family should confirm the final program structure with Ohio counsel
									or another qualified advisor.
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
							<h2 className="text-2xl font-bold mb-3">Ready to join in?</h2>
							<p className="text-muted-foreground mb-5 leading-relaxed">
								Review the rules, choose the basket you want to support, and follow the entry guidance that best fits your family.
							</p>
							<Link
								to="/store"
								className="inline-flex items-center gap-2 gradient-burgundy text-white px-6 py-3 rounded-xl font-semibold hover:shadow-burgundy transition-all duration-200"
							>
								See fundraiser baskets
								<ExternalLink className="h-4 w-4" />
							</Link>
						</div>

						<div className="bg-card rounded-2xl p-8 border border-border/50 shadow-sm">
							<h2 className="text-2xl font-bold mb-3">More ways to stay connected</h2>
							<p className="text-muted-foreground mb-5 leading-relaxed">
								Visit the family business page for community listings, event planning help, and more reunion updates in one place.
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
