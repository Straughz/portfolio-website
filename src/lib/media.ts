import type { ImageMetadata } from 'astro';
import clark from '../assets/print/clark.png';
import compassion from '../assets/print/compassion-care-transport.png';
import cozy from '../assets/print/cozy-aroma-bar.png';
import goodGround from '../assets/print/good-ground-and-co.png';
import harlowTasting from '../assets/print/harlow-wine-co-tasting.png';
import harlow from '../assets/print/harlow-wine-co.png';
import kumuBack from '../assets/print/kumu-hula-nohea-macugay-back.png';
import kumu from '../assets/print/kumu-hula-nohea-macugay.png';
import quantum from '../assets/print/quantum-submetering.png';
import spareRoom from '../assets/print/the-spare-room.png';
import spareRoomBack from '../assets/print/the-spare-room-back.png';
import cokpitHero from '../assets/hero/cokpit-hero.png';
import compassionPage1 from '../assets/print/compassion-care-transport-page-1.png';
import compassionPage2 from '../assets/print/compassion-care-transport-page-2.png';
import compassionPage3 from '../assets/print/compassion-care-transport-page-3.png';
import compassionPage4 from '../assets/print/compassion-care-transport-page-4.png';
import goodGroundFront from '../assets/print/good-ground-and-co-front.png';
import harlowCardBack from '../assets/print/harlow-wine-co-card-back.png';
import harlowCardFront from '../assets/print/harlow-wine-co-card-front.png';
import quantumBack from '../assets/print/quantum-submetering-back.png';

export type ClearedMedia = {
  source: string;
  filename: string;
  width: number;
  height: number;
  alt: string;
  focalPoint: { x: number; y: number };
  sourceNote: 'privacy-reviewed export';
  clearance: 'approved';
  clearanceDate: string;
};

// Add future hero/work imports only after clearance and matching content metadata exist.
const approvedAssets: Readonly<Record<string, ImageMetadata>> = {
  'src/assets/print/clark.png': clark,
  'src/assets/print/compassion-care-transport.png': compassion,
  'src/assets/print/cozy-aroma-bar.png': cozy,
  'src/assets/print/good-ground-and-co.png': goodGround,
  'src/assets/print/harlow-wine-co-tasting.png': harlowTasting,
  'src/assets/print/harlow-wine-co.png': harlow,
  'src/assets/print/kumu-hula-nohea-macugay-back.png': kumuBack,
  'src/assets/print/kumu-hula-nohea-macugay.png': kumu,
  'src/assets/print/quantum-submetering.png': quantum,
  'src/assets/print/the-spare-room.png': spareRoom,
  'src/assets/print/the-spare-room-back.png': spareRoomBack,
  'src/assets/hero/cokpit-hero.png': cokpitHero,
  'src/assets/print/compassion-care-transport-page-1.png': compassionPage1,
  'src/assets/print/compassion-care-transport-page-2.png': compassionPage2,
  'src/assets/print/compassion-care-transport-page-3.png': compassionPage3,
  'src/assets/print/compassion-care-transport-page-4.png': compassionPage4,
  'src/assets/print/good-ground-and-co-front.png': goodGroundFront,
  'src/assets/print/harlow-wine-co-card-back.png': harlowCardBack,
  'src/assets/print/harlow-wine-co-card-front.png': harlowCardFront,
  'src/assets/print/quantum-submetering-back.png': quantumBack,
};

export function resolveApprovedMedia(media: ClearedMedia): ImageMetadata {
  const image = approvedAssets[media.source];
  if (
    media.clearance !== 'approved' ||
    media.sourceNote !== 'privacy-reviewed export' ||
    !/^\d{4}-\d{2}-\d{2}$/.test(media.clearanceDate) ||
    !image ||
    !/^src\/assets\/(?:print|work|hero)\/[a-z0-9-]+\.(?:png|jpe?g|webp|avif)$/.test(media.source) ||
    !media.source.endsWith(`/${media.filename}`) ||
    image.width !== media.width ||
    image.height !== media.height
  ) {
    throw new Error(`Unapproved or mismatched local media: ${media.source}`);
  }
  return image;
}
