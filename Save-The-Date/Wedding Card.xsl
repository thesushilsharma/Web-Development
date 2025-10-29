<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" 
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:output method="html" indent="yes"/>
  
  <xsl:template match="/">
    <html lang="en">
      <head>
        <meta charset="UTF-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <title>Save The Date - Wedding Invitation</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <link href="https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400;600;700&amp;family=Playfair+Display:wght@400;600&amp;display=swap" rel="stylesheet"/>
        <script>
          tailwind.config = {
            theme: {
              extend: {
                fontFamily: {
                  'dancing': ['Dancing Script', 'cursive'],
                  'playfair': ['Playfair Display', 'serif'],
                }
              }
            }
          }
        </script>
        <style>
          .heart-decoration::before {
            content: '♥';
            position: absolute;
            top: 10px;
            left: 50%;
            transform: translateX(-50%);
            font-size: 30px;
            opacity: 0.7;
          }
          .guest-address::before {
            content: '📍';
            margin-right: 8px;
          }
          .guest-email::before {
            content: '✉️';
            margin-right: 8px;
          }
          .no-email::before {
            content: '❌';
            margin-right: 8px;
          }
        </style>
      </head>
      <body class="font-playfair bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 min-h-screen p-5 flex flex-col items-center">
        <div class="bg-white rounded-3xl shadow-2xl max-w-4xl w-full overflow-hidden relative">
          <!-- Header Section -->
          <div class="bg-gradient-to-r from-pink-500 to-orange-400 px-5 py-10 text-center text-white relative heart-decoration">
            <h1 class="font-dancing text-5xl md:text-6xl font-bold mb-3 drop-shadow-lg">Save The Date</h1>
            <p class="text-xl font-normal opacity-90 tracking-widest">WEDDING INVITATION</p>
            <xsl:if test="weddingcard/wedding-info">
              <div class="mt-5 text-lg leading-relaxed">
                <div class="text-xl font-semibold">
                  <xsl:value-of select="weddingcard/wedding-info/bride-name"/> &amp; <xsl:value-of select="weddingcard/wedding-info/groom-name"/>
                </div>
                <div class="mt-3 text-base opacity-90">
                  <xsl:value-of select="weddingcard/wedding-info/wedding-date"/>
                </div>
                <div class="text-sm opacity-80">
                  <xsl:value-of select="weddingcard/wedding-info/venue"/>
                </div>
              </div>
            </xsl:if>
          </div>
          
          <!-- Guest List Section -->
          <div class="px-5 py-10">
            <h2 class="text-center text-3xl text-gray-800 mb-8 font-dancing">Our Beloved VIP Guests</h2>
            <div class="text-center mb-5 text-base text-gray-600 italic">
              Total VIP Guests: <span class="font-semibold text-purple-600"><xsl:value-of select="count(weddingcard/VIPguest)"/></span>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              <xsl:for-each select="weddingcard/VIPguest">
                <xsl:sort select="Name" order="ascending"/>
                <div class="bg-gray-50 rounded-2xl p-6 shadow-lg hover:shadow-xl hover:-translate-y-2 transition-all duration-300 border-l-4 border-pink-500 hover:border-purple-500">
                  <div class="font-dancing text-2xl font-semibold text-gray-800 mb-3">
                    <xsl:value-of select="Name"/>
                  </div>
                  <div class="text-gray-600 mb-2 flex items-center guest-address">
                    <xsl:value-of select="Address"/>
                  </div>
                  <div class="text-sm text-blue-600 flex items-center guest-email">
                    <xsl:choose>
                      <xsl:when test="EmailID != '' and string-length(normalize-space(EmailID)) > 0">
                        <xsl:value-of select="normalize-space(EmailID)"/>
                      </xsl:when>
                      <xsl:otherwise>
                        <span class="text-red-500 italic no-email">Email not provided</span>
                      </xsl:otherwise>
                    </xsl:choose>
                  </div>
                  <xsl:if test="relationship">
                    <div class="mt-3 text-sm text-purple-600 italic flex items-center">
                      <span class="mr-2">👥</span><xsl:value-of select="relationship"/>
                    </div>
                  </xsl:if>
                </div>
              </xsl:for-each>
            </div>
          </div>
          
          <!-- Footer Section -->
          <div class="bg-gray-800 text-white text-center px-5 py-8 font-dancing">
            <div class="text-2xl mb-3">Join us for a celebration of love!</div>
            <div class="text-base opacity-80">More details to follow soon...</div>
          </div>
        </div>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>

