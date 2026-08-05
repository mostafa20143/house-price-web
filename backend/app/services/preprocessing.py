import pandas as pd

def request_to_dataframe(request: dict) -> pd.DataFrame:
    data = {
        "carpet_area_sqft": [request["carpet_area_sqft"]],
        "floor_num_clean": [request["floor_num"]],
        "Bathroom": [request["bathroom"]],
        "Balcony": [request["balcony"]],
        "Car Parking": [0],
        "location_grouped": [request["location"]],
        "Furnishing": [request["furnishing"]],
        "Transaction": [request["transaction"]],
        "Ownership": [request["ownership"]],
        "facing": [request["facing"]],
        "Status": [request["status"]]
    }
    return pd.DataFrame(data)