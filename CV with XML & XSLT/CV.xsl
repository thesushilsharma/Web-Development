<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" 
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:output method="html"/>
	<xsl:template match="/">
		<html>
			<head>
				<title>
					Sushil Sharma
				</title>
				<style type="text/css">
body
{
	background-color: #bbb;
	text-align: center;
	line-height: 24px;
	color: #555;
	margin-top: 20px;
	margin-bottom: 20px;
	font-family: arial;
	font-size: 90%;
}

#container 
{
	margin: 0 auto;
	width: 960px;
	text-align: left;
	background-color: #fff;
	padding-top: 20px;
	padding-bottom: 20px;
}
ul.a {
  list-style-type: circle;
}

#me h1
{
	font-size:580%;
	font-family: Georgia;
	font-style: italic;
	font-weight: normal;
	letter-spacing: -3px;
	margin-left: 20px;
}

#content
{
	margin: 20px;
}

#sxscontainer
{
	margin-top: 20px;
	font-style: italic;
}

#education
{
	float: left;
	width: 250px;
	font-style:italic;
	
}
#edutitle
{
	color:blue;
	font-size: 1.5em;
}
#worktitle
{
	color:green;
	font-size: 1.5em;
}

#employment
{
	float: right;
	width: 500px;
	
}

#hobbiesandinterests
{
	clear:both;
	padding-top: 10px;
}
				</style>
			</head>
			<body>
				<div id="container">
					<div id="me">
						<h1>
							<xsl:value-of select="cv/me/name"/>
						</h1>
						<ul id="contactdetails">
							<li>Address: <xsl:value-of select="cv/me/address"/>
							</li>
							<li>Telephone: <xsl:value-of select="cv/me/telephone"/>
							</li>
							<li>Email: <xsl:value-of select="cv/me/email"/>
							</li>
						</ul>
					</div>
					<div id="content">
						<div id="sxscontainer">
							<div id="education">
								<h2>Education</h2>
								<xsl:for-each select="cv/education/qualification">
									<ul class="a">
										<div id="edutitle">
											<xsl:value-of select="organization"/>
										</div>

										<li>
											<xsl:value-of select="type"/>
										</li>
										<li>
											<b>From:</b>
											<xsl:value-of select="from "/>
										</li>
										<li>
											<b>To:</b>
											<xsl:value-of select="to"/>
										</li>
									</ul>
								</xsl:for-each>
							</div>
							<div id="employment">
								<h2>Employment</h2>
								<xsl:for-each select="cv/employment/experience">

									<ul class="a">
										<div id="worktitle">
											<xsl:value-of select="organization"/>
										</div>
										<li>
											<xsl:value-of select="job_title"/>
										</li>
										<li>
											<b>From:</b>
											<xsl:value-of select="from "/>
										</li>
										<li>
											<b>To:</b>
											<xsl:value-of select="to "/>
										</li>
									</ul>
								</xsl:for-each>
							</div>
						</div>
						<div id="hobbiesandinterests">
							<h2>Hobbies and Interests</h2>
							<xsl:copy-of select="cv/hobandint"/>
						</div>
					</div>
				</div>
			</body>
		</html>
	</xsl:template>
</xsl:stylesheet>
