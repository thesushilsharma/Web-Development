<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" 
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:output method="html" indent="yes"/>
	
	<xsl:template match="/">
		<html lang="en">
			<head>
				<meta charset="UTF-8"/>
				<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
				<title><xsl:value-of select="cv/me/name"/> - Professional CV</title>
				<script src="https://cdn.tailwindcss.com"></script>
				<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&amp;family=Playfair+Display:wght@400;600;700&amp;display=swap" rel="stylesheet"/>
				<script>
					tailwind.config = {
						theme: {
							extend: {
								fontFamily: {
									'inter': ['Inter', 'sans-serif'],
									'playfair': ['Playfair Display', 'serif'],
								}
							}
						}
					}
				</script>
				<style>
					.contact-item::before {
						content: attr(data-icon);
						margin-right: 8px;
					}
					.section-divider {
						background: linear-gradient(90deg, #3b82f6, #8b5cf6, #ec4899);
						height: 3px;
						border-radius: 2px;
					}
				</style>
			</head>
			<body class="font-inter bg-gray-50 min-h-screen py-8">
				<div class="max-w-4xl mx-auto bg-white shadow-2xl rounded-2xl overflow-hidden">
					
					<!-- Header Section -->
					<div class="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white px-8 py-12">
						<div class="text-center">
							<h1 class="font-playfair text-5xl md:text-6xl font-bold mb-4 tracking-tight">
								<xsl:value-of select="cv/me/name"/>
							</h1>
							<div class="w-24 h-1 bg-white/30 mx-auto mb-6 rounded-full"></div>
							<p class="text-xl opacity-90 font-light">Professional Profile</p>
						</div>
						
						<!-- Contact Information -->
						<div class="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 text-center md:text-left">
							<div class="flex items-center justify-center md:justify-start">
								<span class="mr-3 text-2xl">📍</span>
								<div>
									<p class="text-sm opacity-80">Address</p>
									<p class="font-medium"><xsl:value-of select="cv/me/address"/></p>
								</div>
							</div>
							<div class="flex items-center justify-center md:justify-start">
								<span class="mr-3 text-2xl">📞</span>
								<div>
									<p class="text-sm opacity-80">Phone</p>
									<p class="font-medium"><xsl:value-of select="cv/me/telephone"/></p>
								</div>
							</div>
							<div class="flex items-center justify-center md:justify-start">
								<span class="mr-3 text-2xl">✉️</span>
								<div>
									<p class="text-sm opacity-80">Email</p>
									<p class="font-medium"><xsl:value-of select="cv/me/email"/></p>
								</div>
							</div>
						</div>
					</div>

					<!-- Main Content -->
					<div class="p-8">
						<div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
							
							<!-- Education Section -->
							<div class="space-y-6">
								<div>
									<h2 class="text-3xl font-playfair font-bold text-gray-800 mb-2 flex items-center">
										<span class="mr-3 text-blue-600">🎓</span>Education
									</h2>
									<div class="section-divider mb-6"></div>
								</div>
								
								<div class="space-y-4">
									<xsl:for-each select="cv/education/qualification">
										<div class="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border-l-4 border-blue-500 hover:shadow-lg transition-shadow duration-300">
											<h3 class="text-xl font-semibold text-blue-700 mb-2">
												<xsl:value-of select="organization"/>
											</h3>
											<p class="text-gray-700 font-medium mb-3">
												<xsl:value-of select="type"/>
											</p>
											<div class="flex items-center text-sm text-gray-600">
												<span class="bg-blue-100 text-blue-800 px-3 py-1 rounded-full mr-2">
													<xsl:value-of select="from"/> - <xsl:value-of select="to"/>
												</span>
											</div>
										</div>
									</xsl:for-each>
								</div>
							</div>

							<!-- Employment Section -->
							<div class="space-y-6">
								<div>
									<h2 class="text-3xl font-playfair font-bold text-gray-800 mb-2 flex items-center">
										<span class="mr-3 text-green-600">💼</span>Experience
									</h2>
									<div class="section-divider mb-6"></div>
								</div>
								
								<div class="space-y-4">
									<xsl:for-each select="cv/employment/experience">
										<div class="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border-l-4 border-green-500 hover:shadow-lg transition-shadow duration-300">
											<h3 class="text-xl font-semibold text-green-700 mb-2">
												<xsl:value-of select="organization"/>
											</h3>
											<p class="text-gray-700 font-medium mb-3">
												<xsl:value-of select="job_title"/>
											</p>
											<div class="flex items-center text-sm text-gray-600">
												<span class="bg-green-100 text-green-800 px-3 py-1 rounded-full mr-2">
													<xsl:value-of select="from"/> - <xsl:value-of select="to"/>
												</span>
											</div>
										</div>
									</xsl:for-each>
								</div>
							</div>
						</div>

						<!-- Hobbies and Interests Section -->
						<div class="mt-12">
							<div class="mb-6">
								<h2 class="text-3xl font-playfair font-bold text-gray-800 mb-2 flex items-center">
									<span class="mr-3 text-purple-600">🎯</span>Hobbies &amp; Interests
								</h2>
								<div class="section-divider mb-6"></div>
							</div>
							
							<div class="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 border-l-4 border-purple-500">
								<div class="grid grid-cols-2 md:grid-cols-4 gap-4">
									<xsl:for-each select="cv/hobandint/ul/li">
										<div class="bg-white rounded-lg p-4 text-center shadow-sm hover:shadow-md transition-shadow duration-300">
											<div class="text-2xl mb-2">
												<xsl:choose>
													<xsl:when test=". = 'VideoGraphy'">🎥</xsl:when>
													<xsl:when test=". = 'Programming'">💻</xsl:when>
													<xsl:when test=". = 'Hacker'">🔐</xsl:when>
													<xsl:when test=". = 'Blog'">✍️</xsl:when>
													<xsl:otherwise>🎯</xsl:otherwise>
												</xsl:choose>
											</div>
											<p class="text-gray-700 font-medium">
												<xsl:value-of select="."/>
											</p>
										</div>
									</xsl:for-each>
								</div>
							</div>
						</div>

						<!-- Footer -->
						<div class="mt-12 text-center py-6 border-t border-gray-200">
							<p class="text-gray-600 text-sm">
								Professional CV - <span class="font-medium">Last Updated: 2024</span>
							</p>
						</div>
					</div>
				</div>
			</body>
		</html>
	</xsl:template>
</xsl:stylesheet>
