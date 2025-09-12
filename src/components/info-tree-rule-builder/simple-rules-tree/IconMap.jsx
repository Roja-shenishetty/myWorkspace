import {
  Folder as FolderIcon,
  ChevronRight as ChevronRightIcon,
  Article as ArticleIcon,
} from '@mui/icons-material';

// Icon mapping for node types
export const iconMap = {
  Folder: <FolderIcon />,
  ChevronRight: <ChevronRightIcon />,
  Article: <ArticleIcon />,
};
export const iconNames = Object.keys(iconMap);