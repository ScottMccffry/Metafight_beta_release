import os


def find_and_copy_line(directory_path, search_text):
    copied_lines = []
    number_total_api = 0
    # Walk through each directory and its subdirectories
    for root, dirs, files in os.walk(directory_path):
        for file in files:
            file_path = os.path.join(root, file)
            try:
                with open(file_path, 'r', encoding='utf-8') as f:
                    lines = f.readlines()
                    for i in range(1, len(lines)):
                        if search_text in lines[i]:
                            copied_lines.append(file_path.strip())
                            copied_lines.append(lines[i].strip())
                            number_total_api+=1
            except UnicodeDecodeError:
                print(f"Skipping non-UTF-8 encoded file: {file_path}")
    print(number_total_api)
    return copied_lines

if __name__ == "__main__":
    directory_path = input("Enter the directory path: ")
    search_text = input("Enter the text to search for: ")
    copied_lines = find_and_copy_line(directory_path, search_text)
    print("\nCopied lines:")
    for line in copied_lines:
        print(line)

