from web3 import Web3, exceptions
import time

web3 = Web3(Web3.HTTPProvider("http://localhost:8545"))  # Assuming your Ethereum node is running locally

contract_address = '0xYourContractAddress'
contract_abi = [...]  # Your contract ABI goes here

# Create a contract object
contract = web3.eth.contract(address=contract_address, abi=contract_abi)

def handle_event(event):
    # This function will be called when an event is emitted
    print(f"New deposit from {event['args']['user']} with amount {event['args']['amount']}")

def log_loop(event_filter, poll_interval):
    while True:
        try:
            for event in event_filter.get_new_entries():
                handle_event(event)
            time.sleep(poll_interval)
        except exceptions.ConnectionError:
            # Sleep and try again in case of a connection error
            time.sleep(poll_interval)

def main():
    # Create an event filter
    event_filter = contract.events.Deposit.createFilter(fromBlock='latest')

    # Start the log loop
    log_loop(event_filter, 2)

if __name__ == "__main__":
    main()
