import { setFailed } from '@actions/core';
import { context, getOctokit } from '@actions/github';

const { owner, repo } = context.repo;

type Asset = {
  id: number;
  name: string;
  browser_download_url: string;
};

type AssetWithLabel = Asset & {
  label: string;
};

run();

async function run() {
  try {
    const token = String(process.env.ACCESS_TOKEN);
    const releaseId = Number(process.env.RELEASE_ID);

    const octokit = getOctokit(token);

    const releaseAssets = await octokit.request(
      `GET /repos/${owner}/${repo}/releases/${releaseId}/assets`,
    );
    const all = releaseAssets.data as Asset[];
    const sigAssets = all.filter((asset) => asset.name.endsWith('.sig'));
    const assets = all.filter((asset) => !asset.name.endsWith('.sig'));

    console.log('removing .sig assets...');
    await Promise.all(
      sigAssets.map((asset) =>
        octokit.rest.repos.deleteReleaseAsset({
          owner,
          repo,
          asset_id: asset.id,
        }),
      ),
    );

    console.log('adding labels...');
    await Promise.all(
      assets
        .reduce((acc: AssetWithLabel[], asset: Asset) => {
          const { name } = asset;

          if (name.endsWith('.rpm')) {
            acc.push({ ...asset, label: 'ISOS for Linux (rpm)' });
          }
          if (name.endsWith('.deb')) {
            acc.push({ ...asset, label: 'ISOS for Linux (deb)' });
          }
          if (name.endsWith('.exe')) {
            acc.push({ ...asset, label: 'ISOS for Windows' });
          }
          if (name.endsWith('aarch64.dmg')) {
            acc.push({ ...asset, label: 'ISOS for Mac (Apple Silicon)' });
          }
          if (name.endsWith('x64.dmg')) {
            acc.push({ ...asset, label: 'ISOS for Mac (Intel)' });
          }

          return acc;
        }, [])
        .map(({ id, label }) =>
          octokit.rest.repos.updateReleaseAsset({
            owner,
            repo,
            asset_id: id,
            label,
          }),
        ),
    );

    console.log('publishing release...');
    await octokit.rest.repos.updateRelease({
      owner,
      repo,
      release_id: releaseId,
      draft: false,
    });
  } catch (error) {
    setFailed(error as Error);
  }
}
