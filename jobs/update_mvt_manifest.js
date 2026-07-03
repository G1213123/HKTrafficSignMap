const fs = require('fs');
const path = require('path');

const MVT_ROOT = path.join(__dirname, '../public/data/mvt');
const MANIFEST_PATH = path.join(MVT_ROOT, 'manifest.json');

async function gatherMvtManifest() {
    try {
        const items = fs.readdirSync(MVT_ROOT);
        const buildDirs = items.filter(item => {
            // Match YYYY-MM-DD format
            return /^\d{4}-\d{2}-\d{2}$/.test(item);
        }).sort().reverse();

        if (buildDirs.length === 0) {
            console.error('No build directories found in mvt root.');
            return;
        }

        const builds = [];

        for (const dir of buildDirs) {
            const manifestFile = path.join(MVT_ROOT, dir, 'manifest.json');
            if (fs.existsSync(manifestFile)) {
                try {
                    const content = JSON.parse(fs.readFileSync(manifestFile, 'utf8'));
                    builds.push({
                        buildDate: dir,
                        generatedAt: content.generatedAt,
                        startedAt: content.startedAt,
                        minZoom: content.minZoom,
                        maxZoom: content.maxZoom,
                        layers: content.layers,
                        outputRoot: `public/data/mvt/${dir}`
                    });
                } catch (e) {
                    console.warn(`Failed to parse manifest in ${dir}: ${e.message}`);
                }
            } else {
                // If no manifest.json in the build dir, we might just use the dir name
                builds.push({
                    buildDate: dir,
                    generatedAt: null,
                    startedAt: null,
                    minZoom: 12, // Default
                    maxZoom: 18, // Default
                    layers: [],
                    outputRoot: `public/data/mvt/${dir}`
                });
            }
        }

        const finalManifest = {
            generatedAt: new Date().toISOString(),
            latestBuildDate: builds[0].buildDate,
            builds: builds
        };

        fs.writeFileSync(MANIFEST_PATH, JSON.stringify(finalManifest, null, 2));
        console.log(`Successfully updated mvt manifest with ${builds.length} builds.`);
    } catch (error) {
        console.error('Error gathering MVT manifest:', error);
        process.exit(1);
    }
}

gatherMvtManifest();
