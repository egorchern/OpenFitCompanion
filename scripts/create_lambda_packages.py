import subprocess
import sys
import os
import shutil
import re
commonFolderName = "common"
def main():
    # subprocess.run(["npx", "tsc"])
    cwd = os.getcwd()
    srcFolder = os.path.join(cwd, sys.argv[1])
    
    tempFolder = os.path.join(cwd, "temp")
    commonFolder = os.path.join(srcFolder, commonFolderName)
    if os.path.exists(tempFolder):
        shutil.rmtree(tempFolder)
    os.makedirs(tempFolder)
    subFolders = [name for name in os.listdir(srcFolder) if os.path.isdir(os.path.join(srcFolder, name)) and name != commonFolderName]
    for directory in subFolders:
        curTempSubFolder = os.path.join(tempFolder, directory)
        os.makedirs(curTempSubFolder)
        curDirectory = os.path.join(srcFolder, directory)
        files = [name for name in os.listdir(curDirectory) if os.path.isfile(os.path.join(curDirectory, name))]
        for file in files:
            oldPath = os.path.join(curDirectory, file)
            newPath = os.path.join(curTempSubFolder, file)
            print(oldPath)
            with open(oldPath, "r+") as srcFile:
                lines = srcFile.readlines()
                srcFile.seek(0)
                newLines = list(map(lambda x: re.sub("(\.\.)\/", "./", x), lines))
                srcFile.writelines(newLines)
            shutil.copy(oldPath, newPath)
        shutil.copytree(commonFolder, os.path.join(curTempSubFolder, commonFolderName))
        shutil.make_archive(curTempSubFolder, "zip", curTempSubFolder)

if __name__ == "__main__":
    main()