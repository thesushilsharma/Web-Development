<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" 
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:output method="html"/>
  <xsl:template match="/">
    <html>
      <head>
        <title>Wedding Invitation</title>
        <style type="text/css">
body
{
font-family: 'Open Sans', sans-serif;
background: #dedfe1;
margin-left: auto;
margin-right: auto;
width: 10em;
text-align: center;
box-sizing: border-box;

}
.VIPname
{
font-weight:bold;
background-color:teal;
color:white;
padding:4px;

}
.VIPAddress
{
font-size:small;
font-style:italic;
color:Black;
background-color:skyblue;
padding:4px;
}
.VIPEmail
{
font-style:italic;
margin-left:20px;
margin-bottom:1em;
font-size:10pt;
}
        </style>
      </head>
      <body>
        <h2 >Wedding Invitation</h2>
        <xsl:for-each select="weddingcard/VIPguest">
          <xsl:sort select="Name"/>
          <div class="VIPname">
            <xsl:value-of select="Name"/>
          </div>
          <div class="VIPAddress">
            <xsl:value-of select="Address"/>
          </div>
          <div class="VIPEmail">
            <xsl:choose>
              <xsl:when test="EmailID=''">
                <span style="background-color:green">@@@@@</span>
              </xsl:when>
              <xsl:otherwise>
                  <xsl:value-of select="EmailID "/>
              </xsl:otherwise>
            </xsl:choose>
          </div>
        </xsl:for-each>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>

