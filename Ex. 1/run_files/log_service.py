# Functions for Ex.1 part 1


import re
from collections import Counter
def split_log_file(file_path, parts_size=100000):
    """
        Splits a large log file into smaller parts.

        Args:
            file_path (str): The path to the log file.
            parts_size (int): The number of lines per part.
    """
    with open(file_path, 'r', encoding='utf-8') as file:
        part = []
        part_number = 0
        for line in file:
            part.append(line)
            if len(part) >= parts_size:
                with open(f'log_part_{part_number}.txt', 'w', encoding='utf-8') as part_file:
                    part_file.writelines(part)
                part = []
                part_number += 1
        if part:
            with open(f'log_part_{part_number}.txt', 'w', encoding='utf-8') as part_file:
                part_file.writelines(part)

def count_error_codes(file_path):
    """
        Counts the frequency of error codes in a log file.

        Args:
            file_path (str): The path to the log file.

        Returns:
            Counter: A Counter object containing error code frequencies.
    """
    error_code_pattern = re.compile(r'Error:\s*(\w+)')
    error_counts = Counter()
    with open(file_path, 'r', encoding='utf-8') as file:
        for line in file:
            match = error_code_pattern.search(line)
            if match:
                error_counts[match.group(1)] += 1
    return error_counts

def merge_error_counts(part_counts):
    """
        Merges error code frequency counts from multiple parts.

        Args:
            part_counts (list): A list of Counter objects.

        Returns:
            Counter: A merged Counter object.
    """
    merged_counts = Counter()
    for counts in part_counts:
        merged_counts.update(counts)
    return merged_counts

def get_top_n_errors(error_counts, n):
    """
        Finds the top N most frequent error codes.

        Args:
            error_counts (Counter): A Counter object of error code frequencies.
            n (int): The number of top error codes to retrieve.

        Returns:
            list: A list of (error_code, count) tuples.
    """
    return error_counts.most_common(n)