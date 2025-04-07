import os
import pandas as pd

from Partition_service import process_data_modular
from csv_service import process_data_in_parts, process_data, process_csv_file, save_to_csv, calc_overall_hourly_avg, \
    calc_overall_hourly_avg_from_df
from xlsx_convertor_service import convert_xlsx_to_csv
from dotenv import load_dotenv

load_dotenv()

xlsx_file_path = os.getenv('XLSX_FILE_PATH')
csv_file_path = os.getenv('CSV_FILE_PATH')
parquet_file_path = os.getenv('PARQUET_FILE_PATH')

# Converting Excel file to CSV
# convert_xlsx_to_csv(xlsx_file_path, csv_file_path)

# Reading the CSV file
df = pd.read_csv(csv_file_path)

# Processing the CSV file to get hourly averages
avg = process_data(csv_file_path)
output_file = "avg_csv.csv"
save_to_csv(avg, output_file)

#  Processing the CSV file to get hourly averages for all days (per hour) together
overall_hourly_average = calc_overall_hourly_avg(csv_file_path)
output_overall_avg_file = "overall_hourly_average.csv"
save_to_csv(overall_hourly_average, output_overall_avg_file)

# Processing the CSV file in daily parts to get hourly averages
final_avg = process_data_in_parts(csv_file_path)
output_csv_file = "hourly_avg_csv.csv"
save_to_csv(final_avg, output_csv_file)

# Processing the CSV file in daily parts to get hourly averages for all days (per hour) together
avg_by_day = process_data_in_parts(csv_file_path)
overall_hourly_avg = calc_overall_hourly_avg_from_df(avg_by_day.copy())
output_overall_avg_parts_file = "overall_hourly_avg_parts.csv"
save_to_csv(overall_hourly_avg, output_overall_avg_parts_file)

# Processing the CSV file using a modular approach (splitting, processing daily, combining)
process_data_modular(csv_file_path, "processed_data", "final_averages.csv")

# Processing the Parquet file to get hourly averages
parquet_avg = process_data(parquet_file_path)
output_par_file = "hourly_avg_par.csv"
save_to_csv(parquet_avg, output_par_file)