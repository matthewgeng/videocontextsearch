import shutil, sys
def remove(folder_path):
    try:
        shutil.rmtree(folder_path)
    except Exception as e:
        print('Failed to delete %s. Reason: %s' % (folder_path, e))

if __name__ == "__main__":
    folder = sys.argv[1]
    print(f"Folder being removed: {folder}")
    remove(folder)
    print(f"{folder} successfully removed")