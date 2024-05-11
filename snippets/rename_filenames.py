"""python snippets/rename_filenames.py"""

import os
import re


def convert_to_lower(text: str):
    """
    covert PascalCase to kebab-case
    """
    result = re.sub(r"([a-z])([A-Z])", r"\1-\2", text)
    result = re.sub(r"([A-Z])([A-Z][a-z])", r"\1-\2", result)
    result = re.sub(r"([A-Z]+)", lambda x: x.group(1).lower(), result)
    result = result.lower().replace(" ", "-")
    return result + ".tsx"


def rename_filenames(directory: str):
    for root, dirs, files in os.walk(directory):
        for file in files:
            if file.endswith(".tsx"):
                old_path = os.path.join(root, file)
                old_filename = file[:-4]
                new_filename = convert_to_lower(old_filename)
                if old_filename != new_filename:
                    new_path = os.path.join(root, new_filename)
                    print(f"Renaming {old_filename} to {new_filename}")
                    os.rename(old_path, new_path)


if __name__ == "__main__":
    rename_filenames(os.getcwd() + "/src/app")
