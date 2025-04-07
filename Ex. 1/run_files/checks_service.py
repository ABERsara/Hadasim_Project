import pandas as pd

# Preliminary data checks
# This code snippet contains several functions aimed at performing preliminary validation checks on time series data
# stored in a pandas DataFrame. These functions check for the presence of mandatory columns, a valid timestamp format,
# duplicate values, missing values, and a numeric data type for the value column.

def validate_col(df, timestamp, val):
    """
    Validates if 'timestamp' and 'value' columns exist.
    Returns True if columns exist, False otherwise.
    """
    return timestamp in df.columns and val in df.columns

def validate_timestamp_format(df, timestamp):
    """
    Converts the 'timestamp' column to datetime and returns a DataFrame with valid timestamps.
    Prints the number of invalid timestamps removed.
    """

    df[timestamp] = pd.to_datetime(df[timestamp], errors='coerce')

    return df[df[timestamp].notna()].copy()

def check_dup(df, timestamp):
    """
    Checks for duplicate timestamps.
    Returns the number of duplicate timestamps found.
    """
    return df[timestamp].duplicated(keep='first').sum()>0

def remove_dup(df, timestamp):
    """
    Removes duplicate rows based on the 'timestamp' column.
    Returns a new DataFrame without duplicate timestamps, keeping the first occurrence.
    """
    return df.drop_duplicates(subset=[timestamp], keep='first').copy()

def validate_val(df, val):
    """
    Checks if values in the specified 'value' column are numeric.
    Prints a warning if non-numeric values are found (they will be converted later).
    Returns True if the column can be converted to numeric, False otherwise.
    """
    if pd.to_numeric(df[val], errors='coerce').isna().sum() > 0:
        return False
    return True

def convert_to_numeric(df, val):
    """
    Converts the specified 'value' column to numeric and returns a DataFrame with valid numeric values.
    Prints the number of non-numeric values removed.
    """
    df[val] = pd.to_numeric(df[val], errors='coerce')
    return df[df[val].notna()].copy()

def validate_data(df, file_type='csv'):
    """
    Performs preliminary data validation and removes rows with errors.
    Returns a new DataFrame with valid rows.
    """

    timestamp = 'timestamp'
    val = 'value'

    if file_type == 'parquet':
        val = 'mean_value'

    # Check if required columns exist
    if not validate_col(df, timestamp, val):
        return pd.DataFrame()

    # Validate and convert timestamp format
    df = validate_timestamp_format(df, timestamp)

    # Check for and report duplicate timestamps
    if check_dup(df, timestamp):
        df = remove_dup(df, timestamp)

    # Validate value type and convert to numeric
    if not validate_val(df, val):
        df = convert_to_numeric(df, val)

    return df