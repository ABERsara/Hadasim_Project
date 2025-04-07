import os
import pandas as pd
from checks_service import validate_data
from csv_service import calc_hour_avg, save_to_csv

def split_csv_by_date(input_file_path, output_dir="daily_parts"):
    """
    Splits a CSV file into separate daily files.

    Args:
        input_file_path (str): Path to the original CSV file.
        output_dir (str): Name of the directory where daily files will be saved (default: "daily_parts").
    """
    try:
        os.makedirs(output_dir, exist_ok=True)
        df = pd.read_csv(input_file_path)
        df['timestamp'] = pd.to_datetime(df['timestamp'])
        df['date'] = df['timestamp'].dt.date

        for date, daily_data in df.groupby('date'):
            daily_file_path = os.path.join(output_dir, f"{date.isoformat()}.csv")
            daily_data.to_csv(daily_file_path, index=False)

    except FileNotFoundError:
        print(f"Error: Input file '{input_file_path}' not found.")
        return None
    except Exception as e:
        print(f"An error occurred during file splitting: {e}")
        return None
    return output_dir

def process_daily_file(daily_file_path, output_dir="daily_parts"):
    """
    Processes a single daily file, performs validation, and calculates hourly averages, saving to a new CSV.

    Args:
        daily_file_path (str): Path to the daily CSV file.
        output_dir (str): Name of the directory where the hourly averages file will be saved (default: "daily_parts").

    Returns:
        str or None: Path to the hourly averages CSV file if processing was successful, otherwise None.
    """
    try:
        daily_df = pd.read_csv(daily_file_path)
        # if 'timestamp' not in daily_df.columns:
        #     print(f"Error: 'timestamp' column not found in {daily_file_path}")
        #     return None
        # daily_df['timestamp'] = pd.to_datetime(daily_df['timestamp'])
        validated_data = validate_data(daily_df.copy())
        if not validated_data.empty:
            hourly_avg = calc_hour_avg(validated_data)
            base_name = os.path.basename(daily_file_path).replace(".csv", "")
            output_hourly_file = os.path.join(output_dir, f"hourly_{base_name}.csv")
            save_to_csv(hourly_avg, output_hourly_file)
            return output_hourly_file
        else:
            print(f"Skipping hourly averages for {os.path.basename(daily_file_path)} due to validation errors.")
            return None
    except FileNotFoundError:
        print(f"Error: Daily file '{daily_file_path}' not found.")
        return None
    except Exception as e:
        print(f"An error occurred while processing '{daily_file_path}': {e}")
        return None

def combine_hourly_average_files(output_dir="daily_parts", final_output_file="final_hourly_averages.csv"):
    """
    Combines all hourly average files found in the output directory into a single final CSV file.

    Args:
        output_dir (str): Name of the directory containing the daily files (default: "daily_parts").
        final_output_file (str): Name of the final CSV file to save the combined hourly averages (default: "final_hourly_averages.csv").
    """
    final_averages_list = []
    all_files = os.listdir(output_dir)
    hourly_files = [os.path.join(output_dir, f) for f in all_files if f.startswith("hourly_") and f.endswith(".csv")]

    for file in hourly_files:
        try:
            temp_df = pd.read_csv(file)
            final_averages_list.append(temp_df)
        except Exception as e:
            print(f"Error reading file '{file}': {e}")

    if final_averages_list:
        final_averages_df = pd.concat(final_averages_list, ignore_index=True)
        final_output_path = os.path.join(output_dir, final_output_file)
        save_to_csv(final_averages_df, final_output_path)
    else:
        print("\nNo valid hourly average files found to combine.")

def process_data_modular(input_file_path, output_dir="daily_parts", final_output_file="final_hourly_averages.csv"):
    """
    Main function to execute the modular data processing pipeline: splitting, processing, and combining.

    Args:
        input_file_path (str): Path to the original CSV file.
        output_dir (str): Name of the directory for temporary and final files (default: "daily_parts").
        final_output_file (str): Name of the final CSV file for combined hourly averages (default: "final_hourly_averages.csv").
    """
    output_directory = split_csv_by_date(input_file_path, output_dir)

    if output_directory:
        hourly_files_processed = []
        for filename in os.listdir(output_directory):
            if filename.endswith(".csv") and not filename.startswith("hourly_") and filename != final_output_file:
                daily_file_path = os.path.join(output_directory, filename)
                hourly_file = process_daily_file(daily_file_path, output_directory)
                if hourly_file:
                    hourly_files_processed.append(hourly_file)

        combine_hourly_average_files(output_directory, final_output_file)
    else:
        print("File splitting failed, cannot proceed with processing.")