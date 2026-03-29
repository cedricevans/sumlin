import React, { useEffect, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CalendarDays, Download, FileText, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { fetchNewsletterDocuments } from '@/lib/sumlinData';

function formatIssueDate(value) {
	if (!value) {
		return 'Date coming soon';
	}

	return new Intl.DateTimeFormat('en-US', {
		month: 'long',
		day: 'numeric',
		year: 'numeric',
	}).format(new Date(value));
}

function formatFileSize(bytes) {
	if (!bytes) {
		return 'File ready to download';
	}

	if (bytes < 1024 * 1024) {
		return `${Math.max(1, Math.round(bytes / 1024))} KB`;
	}

	return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

const NewsletterPage = () => {
	const [archive, setArchive] = useState({
		documents: [],
		status: 'loading',
		error: null,
	});

	useEffect(() => {
		let active = true;

		const loadArchive = async () => {
			const nextArchive = await fetchNewsletterDocuments();
			if (active) {
				setArchive(nextArchive);
			}
		};

		loadArchive();

		return () => {
			active = false;
		};
	}, []);

	const latestDocument = archive.documents[0] || null;
	const archivedDocuments = useMemo(() => archive.documents.slice(1), [archive.documents]);

	return (
		<>
			<Helmet>
				<title>Newsletter Archive | Sumlin Family Reunion 2026</title>
				<meta
					name="description"
					content="Download the latest Sumlin family newsletter and browse archived issues, reunion updates, and family announcements."
				/>
			</Helmet>

			<div className="min-h-screen bg-background">
				<section className="section-spacing pt-24 md:pt-32 bg-[radial-gradient(circle_at_top,_rgba(212,175,55,0.15),_transparent_35%),linear-gradient(155deg,_rgba(70,6,28,1)_0%,_rgba(40,17,19,1)_55%,_rgba(31,26,24,1)_100%)]">
					<div className="container-custom">
						<div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] items-center">
							<motion.div
								initial={{ opacity: 0, y: 24 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.7 }}
							>
								<div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-semibold text-white/90 mb-6">
									<FileText className="h-4 w-4 text-[#d4af37]" />
									Family Newsletter Archive
								</div>
								<h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
									Download the latest family newsletter and past issues.
								</h1>
								<p className="text-lg text-white/80 leading-relaxed max-w-2xl mb-8">
									This page is now a clean archive for current and older newsletters, so family members can come here, click once, and get the latest document without extra help.
								</p>
								<div className="flex flex-wrap gap-4">
									{latestDocument ? (
										<Button asChild className="gradient-metallic h-12 rounded-xl px-6 font-bold text-black hover:brightness-110">
											<a href={latestDocument.file_url} download>
												Download latest issue
											</a>
										</Button>
									) : (
										<Button asChild className="gradient-metallic h-12 rounded-xl px-6 font-bold text-black hover:brightness-110">
											<Link to="/events">View family calendar</Link>
										</Button>
									)}
									<Button asChild variant="outline" className="h-12 rounded-xl px-6 font-semibold border-white/20 bg-white/10 text-white hover:bg-white/15 hover:text-white">
										<Link to="/contact">Contact the family team</Link>
									</Button>
								</div>
							</motion.div>

								<motion.div
									initial={{ opacity: 0, scale: 0.96 }}
									animate={{ opacity: 1, scale: 1 }}
									transition={{ duration: 0.7, delay: 0.08 }}
									className="rounded-[2rem] border border-white/15 bg-white/95 p-8 shadow-2xl"
								>
									<h2 className="text-3xl font-bold text-foreground mb-4">What you will find here</h2>
									<div className="space-y-4 text-muted-foreground">
										<div className="rounded-2xl bg-muted/60 p-5">
											<p className="text-sm font-semibold text-primary mb-2">Latest issue</p>
											<p>The newest family newsletter is featured first, so you can open the latest update right away.</p>
										</div>
										<div className="rounded-2xl bg-muted/60 p-5">
											<p className="text-sm font-semibold text-primary mb-2">Archive access</p>
											<p>Older issues stay available below, making it easy to go back and revisit past family news and announcements.</p>
										</div>
										<div className="rounded-2xl bg-muted/60 p-5">
											<p className="text-sm font-semibold text-primary mb-2">Easy to use</p>
											<p>Each newsletter is clearly labeled and ready to download, so finding the issue you want stays simple.</p>
										</div>
									</div>
								</motion.div>
						</div>
					</div>
				</section>

				<section className="section-spacing bg-background">
					<div className="container-custom">
						<div className="mb-10 text-center">
							<h2 className="text-4xl font-bold text-foreground">Current issue</h2>
							<p className="text-lg text-muted-foreground max-w-3xl mx-auto mt-4">
								The newest newsletter upload always appears first.
							</p>
						</div>

						{latestDocument ? (
							<div className="rounded-[2rem] border border-border/60 bg-card p-8 md:p-10 shadow-lg">
								<div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
									<div>
										<div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-semibold text-primary mb-5">
											<CalendarDays className="h-4 w-4" />
											{formatIssueDate(latestDocument.issue_date)}
										</div>
										<h3 className="text-4xl font-bold text-foreground">{latestDocument.title}</h3>
										<p className="text-muted-foreground mt-4 text-lg">
											{latestDocument.description || 'The latest family newsletter is ready to download.'}
										</p>
										<p className="text-sm text-muted-foreground mt-4">
											{latestDocument.file_name} · {formatFileSize(latestDocument.file_size_bytes)}
										</p>
									</div>
									<div className="lg:min-w-[220px]">
										<a
											href={latestDocument.file_url}
											download
											className="inline-flex w-full items-center justify-center gap-2 rounded-2xl gradient-burgundy px-6 py-4 font-semibold text-white hover:brightness-110 transition-all duration-200"
										>
											<Download className="h-5 w-5" />
											Download now
										</a>
									</div>
								</div>
							</div>
						) : (
								<div className="rounded-[2rem] border border-dashed border-border bg-muted/40 p-10 text-center">
									<Mail className="h-10 w-10 text-primary mx-auto mb-4" />
									<h3 className="text-2xl font-bold text-foreground">No newsletter uploaded yet</h3>
									<p className="text-muted-foreground max-w-2xl mx-auto mt-4">
										Once the first family newsletter is added, it will appear here as the current issue and older uploads will move into the archive list.
									</p>
								</div>
						)}

						{archive.error && (
							<div className="mt-6 rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 text-sm text-muted-foreground">
								{archive.error.message}
							</div>
						)}
					</div>
				</section>

				<section className="section-spacing bg-muted/40">
					<div className="container-custom">
						<div className="mb-10 text-center">
							<h2 className="text-4xl font-bold text-foreground">Archived newsletters</h2>
							<p className="text-lg text-muted-foreground max-w-3xl mx-auto mt-4">
								Older issues stay available here for family members who want to go back and review previous updates.
							</p>
						</div>

						{archivedDocuments.length > 0 ? (
							<div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
								{archivedDocuments.map((document, index) => (
									<motion.div
										key={document.id}
										initial={{ opacity: 0, y: 24 }}
										whileInView={{ opacity: 1, y: 0 }}
										viewport={{ once: true }}
										transition={{ duration: 0.5, delay: index * 0.08 }}
										className="rounded-3xl border border-border/60 bg-card p-7 shadow-sm"
									>
										<div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl gradient-gold text-foreground mb-5">
											<FileText className="h-5 w-5" />
										</div>
										<p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
											{formatIssueDate(document.issue_date)}
										</p>
										<h3 className="text-2xl font-bold text-foreground mt-3">{document.title}</h3>
										<p className="text-muted-foreground mt-3">
											{document.description || 'Archived family newsletter issue.'}
										</p>
										<p className="text-sm text-muted-foreground mt-4">
											{document.file_name} · {formatFileSize(document.file_size_bytes)}
										</p>
										<a
											href={document.file_url}
											download
											className="mt-6 inline-flex items-center gap-2 font-semibold text-primary hover:text-primary/80"
										>
											<Download className="h-4 w-4" />
											Download issue
										</a>
									</motion.div>
								))}
							</div>
						) : (
							<div className="rounded-[2rem] border border-border/60 bg-card p-8 text-center text-muted-foreground">
								Archive issues will appear here after newer newsletters are uploaded.
							</div>
						)}
					</div>
				</section>
			</div>
		</>
	);
};

export default NewsletterPage;
