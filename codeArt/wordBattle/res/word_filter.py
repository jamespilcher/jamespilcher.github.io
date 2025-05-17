# read all words in words.txt
# filter words that are longer than 17 characters

import os
import re
import sys


def filter_words(file_path):
    print(f"Filtering words from {file_path}...")
    if not os.path.exists(file_path):
        print(f"File {file_path} does not exist.")
        return []

    with open(file_path, 'r', encoding='utf-8') as file:
        words = file.readlines()
    # Filter words that are longer than 17 characters
    filtered_words = [word.strip() for word in words if len(word.strip()) <= 17]
    filtered_words = [word.strip() for word in words if len(word.strip()) >= 3]

    # Save the filtered words to a new file
    output_file_path = os.path.join(os.path.dirname(file_path), 'filtered_words.txt')
    with open(output_file_path, 'w', encoding='utf-8') as output_file:
        output_file.write('\n'.join(filtered_words))

    print(f"Filtered words saved to {output_file_path}")
    return filtered_words

if __name__ == "__main__":
    # Get the path to the words.txt file
    words_path = r"""C:\Users\pilch\jamespilcher.github.io\codeArt\wordBattle\res\words.txt"""

    # Filter the words
    filter_words(words_path)