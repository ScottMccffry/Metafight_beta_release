import os

def compile_files_to_single_text(directory_path, output_file_path):
    # Create or overwrite the output file
    with open(output_file_path, 'w', encoding='utf-8') as output_file:
        # Walk through each directory and its subdirectories
        for root, dirs, files in os.walk(directory_path):
            # Skip __pycache__ directories and any subdirectories within them
            dirs[:] = [d for d in dirs if d != '__pycache__']
            
            for file in files:
                file_path = os.path.join(root, file)
                try:
                    with open(file_path, 'r', encoding='utf-8') as f:
                        content = f.read()
                        output_file.write(f"\n\n=== Content from {file_path} ===\n\n")
                        output_file.write(content)
                except UnicodeDecodeError:
                    print(f"Skipping non-UTF-8 encoded file: {file_path}")

if __name__ == "__main__":
    directory_path = input("Enter the directory path: ")
    output_file_path = input("Enter the path for the compiled output text file: ")
    compile_files_to_single_text(directory_path, output_file_path)
    print(f"Text from all files compiled to: {output_file_path}")
