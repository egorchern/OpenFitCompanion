import subprocess
import sys
import os
import shutil

def main():
    # subprocess.run(["npx", "tsc"])
    cwd = os.getcwd()
    srcFolder = os.path.join(cwd, sys.argv[1])
    
    tempFolder = os.path.join(cwd, "temp")
    dbFolder = os.path.join(srcFolder, "db")
    if os.path.exists(tempFolder):
        shutil.rmtree(tempFolder)
    os.makedirs(tempFolder)
    subFolders = [name for name in os.listdir(srcFolder) if os.path.isdir(os.path.join(srcFolder, name)) and name != 'db']
    for directory in subFolders:
        curTempSubFolder = os.path.join(tempFolder, directory)
        os.makedirs(curTempSubFolder)
        curDirectory = os.path.join(srcFolder, directory)
        files = [name for name in os.listdir(curDirectory) if os.path.isfile(os.path.join(curDirectory, name))]
        for file in files:
            oldPath = os.path.join(curDirectory, file)
            newPath = os.path.join(curTempSubFolder, file)
            shutil.copy(oldPath, newPath)
        shutil.copytree(dbFolder, os.path.join(curTempSubFolder, "db"))
        shutil.make_archive(curTempSubFolder, "zip", curTempSubFolder)

if __name__ == "__main__":
    main()