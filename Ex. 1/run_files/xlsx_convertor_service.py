# Functions for Ex.1 part 1


import pandas as pd


def convert_xlsx_to_txt(excel_file, txt_file):
    """
        Converts an Excel file to a text file.

        Args:
            excel_file (str): Path to the input Excel file (.xlsx).
            txt_file (str): Path to the output text file (.txt).

        Returns:
            bool: True if conversion was successful, False otherwise.
    """
    try:
        df = pd.read_excel(excel_file)
        df.to_csv(txt_file, index=False, header=False, sep='\t')
        return True
    except Exception as e:
        print(f"Error converting Excel to TXT: {e}")
    return False


def ensure_text_file(file_path):
    """
           Ensures that the input file is a text file. Converts Excel if needed.

           Args:
               file_path (str): Path to the input file (.txt or .xlsx).

           Returns:
               str: Path to the text file (.txt) if successful, None otherwise.
    """
    if file_path.endswith('.xlsx'):
        txt_file = file_path.replace('.xlsx', '.txt')
        if convert_xlsx_to_txt(file_path, txt_file):
            return txt_file
        else:
            return None
    elif file_path.endswith('.txt'):
        return file_path
    else:
        print("Unsupported file format. Please provide a .txt or .xlsx file.")
        return None

def convert_xlsx_to_csv(excel_file_path, csv_file_path):
    """
    Converts an Excel file to a CSV file.
    Args:
        excel_file_path (str): Path to the excel file.
        csv_file_path (str): Path to the CSV file.

    Returns:
        None
    """
    try:
        # Reading the Excel file
        df = pd.read_excel(excel_file_path)

        # Saving the DataFrame as a CSV file
        df.to_csv(csv_file_path, index=False)

    except FileNotFoundError:
        return None
    except Exception as e:
        return None

