# main for Ex.1 part 1

import os
from log_service import split_log_file, count_error_codes, merge_error_counts, get_top_n_errors
from xlsx_convertor_service import ensure_text_file
from dotenv import load_dotenv

load_dotenv()

while True:
    try:
        n = int(input("Enter the number of top errors to find (N): "))
        break
    except ValueError:
        print("Invalid input. Please enter an integer.")

file_path = os.getenv("LOG_FILE_PATH")

if not os.path.exists(file_path):
    print(f"Error: File not found at {file_path}")
else:
    text_file_path = ensure_text_file(file_path)

    if text_file_path:
        split_log_file(text_file_path)

        part_counts = []
        for i in range(len([filename for filename in os.listdir() if filename.startswith("log_part_")])):
            part_counts.append(count_error_codes(f'log_part_{i}.txt'))

        merged_counts = merge_error_counts(part_counts)
        top_errors = get_top_n_errors(merged_counts, n)
        print(f"Top {n} error codes:", top_errors)
    else:
        print("File processing failed.")