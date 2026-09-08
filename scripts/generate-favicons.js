const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// 1. Master Icon SVG (512x512)
const iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="none">
    <!-- Rounded Squircle Background with Deep Teal Brand Color -->
    <rect width="512" height="512" rx="112" fill="#0F5450" />
    <rect x="8" y="8" width="496" height="496" rx="104" stroke="#FFFFFF" stroke-opacity="0.16" stroke-width="6" />
    
    <!-- Pediment (Triangular Roof) -->
    <path d="M256 76 L432 176 L80 176 Z" fill="#FFFFFF" />
    <path d="M256 104 L396 176 L116 176 Z" fill="#E4EFED" fill-opacity="0.3" />
    
    <!-- Open Book Crest in Pediment Center -->
    <path d="M256 140 C245 134 230 134 220 136 L220 155 C230 153 245 153 256 159 C267 153 282 153 292 155 L292 136 C282 134 267 134 256 140 Z" fill="#8A6516" />
    <circle cx="256" cy="124" r="4.5" fill="#8A6516" />

    <!-- Architrave Beam / Frieze -->
    <rect x="72" y="176" width="368" height="28" rx="4" fill="#FFFFFF" />
    <rect x="78" y="186" width="356" height="4" rx="2" fill="#0F5450" fill-opacity="0.25" />

    <!-- 4 Grand Classical Columns -->
    <!-- Column 1 -->
    <rect x="108" y="204" width="42" height="176" rx="4" fill="#FFFFFF" />
    <rect x="100" y="204" width="58" height="14" rx="3" fill="#E4EFED" />
    <rect x="100" y="366" width="58" height="14" rx="3" fill="#E4EFED" />
    <line x1="129" y1="218" x2="129" y2="366" stroke="#0F5450" stroke-opacity="0.18" stroke-width="4" />

    <!-- Column 2 -->
    <rect x="194" y="204" width="36" height="176" rx="4" fill="#FFFFFF" />
    <rect x="188" y="204" width="48" height="14" rx="3" fill="#E4EFED" />
    <rect x="188" y="366" width="48" height="14" rx="3" fill="#E4EFED" />
    <line x1="212" y1="218" x2="212" y2="366" stroke="#0F5450" stroke-opacity="0.18" stroke-width="4" />

    <!-- Column 3 -->
    <rect x="282" y="204" width="36" height="176" rx="4" fill="#FFFFFF" />
    <rect x="276" y="204" width="48" height="14" rx="3" fill="#E4EFED" />
    <rect x="276" y="366" width="48" height="14" rx="3" fill="#E4EFED" />
    <line x1="300" y1="218" x2="300" y2="366" stroke="#0F5450" stroke-opacity="0.18" stroke-width="4" />

    <!-- Column 4 -->
    <rect x="362" y="204" width="42" height="176" rx="4" fill="#FFFFFF" />
    <rect x="354" y="204" width="58" height="14" rx="3" fill="#E4EFED" />
    <rect x="354" y="366" width="58" height="14" rx="3" fill="#E4EFED" />
    <line x1="383" y1="218" x2="383" y2="366" stroke="#0F5450" stroke-opacity="0.18" stroke-width="4" />

    <!-- Central Archive Portal / Library Entrance Arch with Shelved Books -->
    <path d="M230 380 L230 266 C230 252 242 240 256 240 C270 240 282 252 282 266 L282 380 Z" fill="#093835" />
    <!-- Warm Shelved Reference Books in Entrance -->
    <rect x="240" y="276" width="32" height="6.5" rx="1.5" fill="#F5EEDC" />
    <rect x="240" y="289" width="32" height="6.5" rx="1.5" fill="#8A6516" />
    <rect x="240" y="302" width="32" height="6.5" rx="1.5" fill="#FFFFFF" />
    <rect x="240" y="315" width="32" height="6.5" rx="1.5" fill="#E4EFED" />
    <!-- Vertical Book Spines -->
    <rect x="241" y="328" width="8" height="34" rx="1.5" fill="#8A6516" />
    <rect x="251" y="328" width="8" height="34" rx="1.5" fill="#FFFFFF" />
    <rect x="261" y="331" width="8" height="31" rx="1.5" fill="#F5EEDC" />

    <!-- 3 Foundation Podium Steps -->
    <rect x="80" y="380" width="352" height="18" rx="3" fill="#FFFFFF" />
    <rect x="60" y="398" width="392" height="20" rx="3" fill="#E4EFED" />
    <rect x="40" y="418" width="432" height="24" rx="4" fill="#FFFFFF" />
</svg>`;

// 2. Open Graph Image SVG (1200x630) for WhatsApp and Social Previews
const ogSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630" fill="none">
    <defs>
        <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#0A3C39" />
            <stop offset="50%" stop-color="#0F5450" />
            <stop offset="100%" stop-color="#143438" />
        </linearGradient>
        <pattern id="dotPattern" x="0" y="0" width="32" height="32" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1.5" fill="#FFFFFF" fill-opacity="0.07" />
        </pattern>
    </defs>

    <!-- Background -->
    <rect width="1200" height="630" fill="url(#bgGrad)" />
    <rect width="1200" height="630" fill="url(#dotPattern)" />
    <rect x="24" y="24" width="1152" height="582" rx="20" stroke="#FFFFFF" stroke-opacity="0.12" stroke-width="2" />

    <!-- Top Tagline Bar -->
    <g transform="translate(80, 75)">
        <rect width="420" height="36" rx="18" fill="#FFFFFF" fill-opacity="0.1" stroke="#FFFFFF" stroke-opacity="0.18" />
        <circle cx="20" cy="18" r="5" fill="#D4AF37" />
        <text x="36" y="23" fill="#F5EEDC" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="14" font-weight="600" letter-spacing="1">
            SDA × NUS EXECUTIVE LEADERSHIP INITIATIVE
        </text>
    </g>

    <!-- Main Arabic Title -->
    <text x="80" y="220" fill="#FFFFFF" font-family="'Thmanyah Serif Display', 'Amiri', 'Traditional Arabic', serif" font-size="78" font-weight="bold">
        المكتبة
    </text>
    
    <!-- English Submark -->
    <text x="350" y="220" fill="#D4AF37" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="52" font-weight="300">
        · Al-Maktaba
    </text>

    <!-- Core Description Text -->
    <text x="80" y="285" fill="#FFFFFF" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="25" font-weight="500">
        مكتبة مشتركة لأساليب عمل الذكاء الاصطناعي للمنظمات السعودية
    </text>
    <text x="80" y="325" fill="#E4EFED" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="20">
        A shared library of AI work methods · Published once, reused across entities
    </text>

    <!-- Key Metrics / Feature Badges -->
    <g transform="translate(80, 390)">
        <!-- Badge 1 -->
        <g>
            <rect width="210" height="64" rx="10" fill="#FFFFFF" fill-opacity="0.08" stroke="#FFFFFF" stroke-opacity="0.15" />
            <text x="20" y="27" fill="#E4EFED" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="13">القطاعات المشمولة</text>
            <text x="20" y="51" fill="#FFFFFF" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="20" font-weight="bold">10 قطاعات وطنية</text>
        </g>
        <!-- Badge 2 -->
        <g transform="translate(225, 0)">
            <rect width="210" height="64" rx="10" fill="#FFFFFF" fill-opacity="0.08" stroke="#FFFFFF" stroke-opacity="0.15" />
            <text x="20" y="27" fill="#E4EFED" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="13">طبيعة القياس</text>
            <text x="20" y="51" fill="#D4AF37" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="20" font-weight="bold">ساعات مستعادة فعلية</text>
        </g>
        <!-- Badge 3 -->
        <g transform="translate(450, 0)">
            <rect width="210" height="64" rx="10" fill="#FFFFFF" fill-opacity="0.08" stroke="#FFFFFF" stroke-opacity="0.15" />
            <text x="20" y="27" fill="#E4EFED" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="13">المواءمة التنظيمية</text>
            <text x="20" y="51" fill="#FFFFFF" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="20" font-weight="bold">سدايا و PDPL</text>
        </g>
    </g>

    <!-- Bottom URL Link Pill -->
    <g transform="translate(80, 505)">
        <text x="0" y="20" fill="#D4AF37" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="18" font-weight="600" letter-spacing="0.5">
            almaktaba-liard.vercel.app
        </text>
    </g>

    <!-- Right Side: Prominent Classical Library Facade Emblem -->
    <g transform="translate(800, 115)">
        <!-- Emblem Container Badge -->
        <rect width="320" height="400" rx="28" fill="#FFFFFF" fill-opacity="0.06" stroke="#FFFFFF" stroke-opacity="0.2" />
        
        <!-- Scaled Library Mark inside Badge -->
        <g transform="translate(10, 20) scale(0.6)">
            <!-- Pediment Roof -->
            <path d="M256 60 L448 160 L64 160 Z" fill="#FFFFFF" />
            <path d="M256 90 L400 160 L112 160 Z" fill="#E4EFED" fill-opacity="0.25" />
            
            <!-- Book Crest in Pediment -->
            <path d="M256 128 C244 122 228 122 216 124 L216 144 C228 142 244 142 256 148 C268 142 284 142 296 144 L296 124 C284 122 268 122 256 128 Z" fill="#D4AF37" />
            
            <!-- Architrave / Frieze -->
            <rect x="56" y="160" width="400" height="28" rx="4" fill="#FFFFFF" />
            
            <!-- 4 Classical Columns -->
            <rect x="92" y="188" width="42" height="196" rx="4" fill="#FFFFFF" />
            <rect x="84" y="188" width="58" height="14" rx="3" fill="#E4EFED" />
            <rect x="84" y="370" width="58" height="14" rx="3" fill="#E4EFED" />
            <line x1="113" y1="202" x2="113" y2="370" stroke="#0F5450" stroke-opacity="0.2" stroke-width="4" />

            <rect x="184" y="188" width="38" height="196" rx="4" fill="#FFFFFF" />
            <rect x="176" y="188" width="54" height="14" rx="3" fill="#E4EFED" />
            <rect x="176" y="370" width="54" height="14" rx="3" fill="#E4EFED" />
            <line x1="203" y1="202" x2="203" y2="370" stroke="#0F5450" stroke-opacity="0.2" stroke-width="4" />

            <rect x="290" y="188" width="38" height="196" rx="4" fill="#FFFFFF" />
            <rect x="282" y="188" width="54" height="14" rx="3" fill="#E4EFED" />
            <rect x="282" y="370" width="54" height="14" rx="3" fill="#E4EFED" />
            <line x1="309" y1="202" x2="309" y2="370" stroke="#0F5450" stroke-opacity="0.2" stroke-width="4" />

            <rect x="378" y="188" width="42" height="196" rx="4" fill="#FFFFFF" />
            <rect x="370" y="188" width="58" height="14" rx="3" fill="#E4EFED" />
            <rect x="370" y="370" width="58" height="14" rx="3" fill="#E4EFED" />
            <line x1="399" y1="202" x2="399" y2="370" stroke="#0F5450" stroke-opacity="0.2" stroke-width="4" />

            <!-- Arch with Reference Books -->
            <path d="M228 384 L228 260 C228 244 240 232 256 232 C272 232 284 244 284 260 L284 384 Z" fill="#082A28" />
            <rect x="238" y="272" width="36" height="7.5" rx="1.5" fill="#D4AF37" />
            <rect x="238" y="286" width="36" height="7.5" rx="1.5" fill="#FFFFFF" />
            <rect x="238" y="300" width="36" height="7.5" rx="1.5" fill="#E4EFED" />
            <rect x="238" y="314" width="36" height="7.5" rx="1.5" fill="#D4AF37" />
            <rect x="240" y="330" width="9" height="38" rx="1.5" fill="#D4AF37" />
            <rect x="251" y="330" width="9" height="38" rx="1.5" fill="#FFFFFF" />
            <rect x="262" y="334" width="9" height="34" rx="1.5" fill="#E4EFED" />

            <!-- 3 Foundation Steps -->
            <rect x="64" y="384" width="384" height="20" rx="3" fill="#FFFFFF" />
            <rect x="44" y="404" width="424" height="22" rx="3" fill="#E4EFED" />
            <rect x="24" y="426" width="464" height="26" rx="4" fill="#FFFFFF" />
        </g>
    </g>
</svg>`;

// Helper: Build standard Windows ICO file from PNG buffers
function createIco(pngItems) {
    const count = pngItems.length;
    const headerSize = 6 + count * 16;
    let currentOffset = headerSize;
    const entries = [];
    for (const item of pngItems) {
        entries.push({
            width: item.width >= 256 ? 0 : item.width,
            height: item.height >= 256 ? 0 : item.height,
            size: item.buffer.length,
            offset: currentOffset,
            buffer: item.buffer,
        });
        currentOffset += item.buffer.length;
    }
    const icoBuffer = Buffer.alloc(currentOffset);
    icoBuffer.writeUInt16LE(0, 0); // reserved
    icoBuffer.writeUInt16LE(1, 2); // icon type
    icoBuffer.writeUInt16LE(count, 4); // count

    let entryPos = 6;
    for (const e of entries) {
        icoBuffer.writeUInt8(e.width, entryPos);
        icoBuffer.writeUInt8(e.height, entryPos + 1);
        icoBuffer.writeUInt8(0, entryPos + 2); // color count
        icoBuffer.writeUInt8(0, entryPos + 3); // reserved
        icoBuffer.writeUInt16LE(1, entryPos + 4); // color planes
        icoBuffer.writeUInt16LE(32, entryPos + 6); // bpp
        icoBuffer.writeUInt32LE(e.size, entryPos + 8);
        icoBuffer.writeUInt32LE(e.offset, entryPos + 12);
        entryPos += 16;
        e.buffer.copy(icoBuffer, e.offset);
    }
    return icoBuffer;
}

async function main() {
    console.log('Generating Al-Maktaba favicons, app icons, and Open Graph previews...');

    const svgBuffer = Buffer.from(iconSvg);

    // Save SVGs
    fs.writeFileSync(path.join(__dirname, '../public/icon.svg'), iconSvg);
    fs.writeFileSync(path.join(__dirname, '../src/app/icon.svg'), iconSvg);

    // Generate PNGs
    const png16 = await sharp(svgBuffer).resize(16, 16).png().toBuffer();
    const png32 = await sharp(svgBuffer).resize(32, 32).png().toBuffer();
    const png48 = await sharp(svgBuffer).resize(48, 48).png().toBuffer();
    const png180 = await sharp(svgBuffer).resize(180, 180).png().toBuffer();
    const png192 = await sharp(svgBuffer).resize(192, 192).png().toBuffer();
    const png512 = await sharp(svgBuffer).resize(512, 512).png().toBuffer();

    // Create multi-res ICO
    const icoBuffer = createIco([
        { width: 16, height: 16, buffer: png16 },
        { width: 32, height: 32, buffer: png32 },
        { width: 48, height: 48, buffer: png48 },
    ]);

    // Write ICO to both public/ and src/app/
    fs.writeFileSync(path.join(__dirname, '../public/favicon.ico'), icoBuffer);
    fs.writeFileSync(path.join(__dirname, '../src/app/favicon.ico'), icoBuffer);

    // Write PNG icons
    fs.writeFileSync(path.join(__dirname, '../public/icon.png'), png32);
    fs.writeFileSync(path.join(__dirname, '../src/app/icon.png'), png32);
    fs.writeFileSync(path.join(__dirname, '../public/apple-touch-icon.png'), png180);
    fs.writeFileSync(path.join(__dirname, '../src/app/apple-icon.png'), png180);
    fs.writeFileSync(path.join(__dirname, '../public/icon-192.png'), png192);
    fs.writeFileSync(path.join(__dirname, '../public/icon-512.png'), png512);

    // Generate 1200x630 Open Graph PNG for WhatsApp & Social Media
    const ogBuffer = Buffer.from(ogSvg);
    const ogPng = await sharp(ogBuffer).resize(1200, 630).png({ quality: 95 }).toBuffer();
    fs.writeFileSync(path.join(__dirname, '../public/og-image.png'), ogPng);

    // Also generate a square WhatsApp-tailored preview (600x600)
    const squareWhatsAppSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600" fill="none">
        <rect width="600" height="600" fill="#0F5450" />
        <rect x="16" y="16" width="568" height="568" rx="28" stroke="#FFFFFF" stroke-opacity="0.12" stroke-width="3" />
        
        <!-- Center Emblem -->
        <g transform="translate(100, 40) scale(0.78)">
            <!-- Pediment Roof -->
            <path d="M256 60 L448 160 L64 160 Z" fill="#FFFFFF" />
            <path d="M256 90 L400 160 L112 160 Z" fill="#E4EFED" fill-opacity="0.25" />
            <path d="M256 128 C244 122 228 122 216 124 L216 144 C228 142 244 142 256 148 C268 142 284 142 296 144 L296 124 C284 122 268 122 256 128 Z" fill="#D4AF37" />
            <rect x="56" y="160" width="400" height="28" rx="4" fill="#FFFFFF" />
            <rect x="92" y="188" width="42" height="196" rx="4" fill="#FFFFFF" />
            <rect x="184" y="188" width="38" height="196" rx="4" fill="#FFFFFF" />
            <rect x="290" y="188" width="38" height="196" rx="4" fill="#FFFFFF" />
            <rect x="378" y="188" width="42" height="196" rx="4" fill="#FFFFFF" />
            <path d="M228 384 L228 260 C228 244 240 232 256 232 C272 232 284 244 284 260 L284 384 Z" fill="#082A28" />
            <rect x="238" y="272" width="36" height="7.5" rx="1.5" fill="#D4AF37" />
            <rect x="238" y="286" width="36" height="7.5" rx="1.5" fill="#FFFFFF" />
            <rect x="238" y="300" width="36" height="7.5" rx="1.5" fill="#E4EFED" />
            <rect x="238" y="314" width="36" height="7.5" rx="1.5" fill="#D4AF37" />
            <rect x="240" y="330" width="9" height="38" rx="1.5" fill="#D4AF37" />
            <rect x="251" y="330" width="9" height="38" rx="1.5" fill="#FFFFFF" />
            <rect x="262" y="334" width="9" height="34" rx="1.5" fill="#E4EFED" />
            <rect x="64" y="384" width="384" height="20" rx="3" fill="#FFFFFF" />
            <rect x="44" y="404" width="424" height="22" rx="3" fill="#E4EFED" />
            <rect x="24" y="426" width="464" height="26" rx="4" fill="#FFFFFF" />
        </g>
        
        <!-- Typography -->
        <text x="300" y="470" text-anchor="middle" fill="#FFFFFF" font-family="'Thmanyah Serif Display', 'Amiri', 'Traditional Arabic', serif" font-size="52" font-weight="bold">
            المكتبة · Al-Maktaba
        </text>
        <text x="300" y="515" text-anchor="middle" fill="#E4EFED" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="19">
            مكتبة أساليب عمل الذكاء الاصطناعي للمنظمات السعودية
        </text>
        <text x="300" y="555" text-anchor="middle" fill="#D4AF37" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="15" font-weight="600" letter-spacing="1">
            SDA × NUS LEADERSHIP PROGRAMME
        </text>
    </svg>`;
    const squarePng = await sharp(Buffer.from(squareWhatsAppSvg)).resize(600, 600).png().toBuffer();
    fs.writeFileSync(path.join(__dirname, '../public/whatsapp-preview.png'), squarePng);

    console.log('Successfully generated all icons and Open Graph previews!');
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});
