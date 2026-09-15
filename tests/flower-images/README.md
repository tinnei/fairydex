# Flower engine test images

This folder contains two Wikimedia Commons photographs for each species currently ranked by the browser engine:

- water-lily
- dandelion
- common-daisy
- common-poppy
- red-clover
- common-bluebell

Use manifest.json for the expected label, Commons file page, author, licence, licence URL, and original image URL.

## Testing notes

- The set deliberately includes different viewpoints and growth stages.
- Expected labels come from the Commons search/file metadata and are not an expert re-identification.
- Some images contain insects, multiple flowers, seed heads, or substantial background. Those are useful stress cases for segmentation.
- Preserve the attribution and licence information when copying or redistributing an image.
