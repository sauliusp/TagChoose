import { Folder } from '../types/Folder';
import { Bookmark } from '../types/Bookmark';
import { SavedTab } from '../types/SavedTab';

class BookmarkService {
  private static instance: BookmarkService;

  private constructor() {}

  public static getInstance(): BookmarkService {
    if (!BookmarkService.instance) {
      BookmarkService.instance = new BookmarkService();
    }
    return BookmarkService.instance;
  }

  async getAllFolders(): Promise<Folder[]> {
    const flattenFolders = (nodes: Folder[]): Folder[] => {
      const folders: Folder[] = [];
      for (const node of nodes) {
        if (node.children) {
          const { id, title, children } = node;

          folders.push({ id, title });
          folders.push(...flattenFolders(children));
        }
      }
      return folders;
    };

    const bookmarkTree = await chrome.bookmarks.getTree();

    return flattenFolders(bookmarkTree);
  }

  async upsertBookmarkInMultipleFolders(
    folderIds: string[],
    title: string,
    url: string,
  ): Promise<{ updated: number; created: number }> {
    if (!folderIds || !title || !url) {
      throw new Error(
        'Folder IDs, title, and URL are required to create bookmarks.',
      );
    }

    const result = {
      updated: 0,
      created: 0,
    };

    if (folderIds.length === 0) {
      folderIds = ['1']; // Default to the "Bookmarks Bar" folder.
    }

    const folderIdsSet = new Set(folderIds);

    const matchingBookmarks = await this.searchByUrl(url);

    for (const bookmark of matchingBookmarks) {
      if (!bookmark.parentId) {
        continue;
      }

      if (folderIdsSet.has(bookmark.parentId)) {
        await chrome.bookmarks.update(bookmark.id, { title });

        result.updated += 1;

        folderIdsSet.delete(bookmark.parentId);

        continue;
      }

      await chrome.bookmarks.remove(bookmark.id);
    }

    for (const folderId of folderIdsSet) {
      await chrome.bookmarks.create({
        parentId: folderId,
        title,
        url,
      });

      result.created += 1;
    }

    return result;
  }

  async searchByUrl(url: string): Promise<Bookmark[]> {
    if (!url) {
      throw new Error('URL is required to search bookmarks.');
    }

    return await chrome.bookmarks.search({ url });
  }

  async getSavedTabByUrl(url: string): Promise<SavedTab | null> {
    if (!url) {
      throw new Error('URL is required to search bookmarks.');
    }

    const matchingBookmarks = await this.searchByUrl(url);

    if (matchingBookmarks.length === 0) {
      return null;
    }

    const bookmark = matchingBookmarks[0];
    const folderIds = new Set<string>();

    for (const match of matchingBookmarks) {
      if (match.parentId) {
        folderIds.add(match.parentId);
      }
    }

    const folderPromises = Array.from(folderIds).map((folderId) =>
      chrome.bookmarks.get(folderId).then((folders) => folders[0]),
    );

    const folders = await Promise.all(folderPromises);

    return { bookmark, folders };
  }
}

export const bookmarkService = BookmarkService.getInstance();
