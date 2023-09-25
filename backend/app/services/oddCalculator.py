import requests
from flask import jsonify
from app.models import GameStatistics
from app.models import Bets
from app.models import Fight
from app.database import db
# don't forget to change the Game Server URL
class oddCalculator:
    @staticmethod
    def fetch_game_statistics(game_id):
        try:
            response = requests.get(f'http://game-server-url/api/game/{game_id}/statistics')

            if response.status_code == 200:
                data = response.json()
                
                # Check that the response has the expected structure
                if 'total_games' in data and 'total_wins' in data:
                    return data

            return None

        except requests.exceptions.RequestException as e:
            print(f"An error occurred while fetching game statistics: {e}")
            return None
        
    @staticmethod
    def fetch_game_statistics_temp(fightId):
        try:
            
            game_statistics= GameStatistics.query.filter_by(fightId=fightId).first()
            return jsonify(game_statistics.to_dict()), 200
          
                
            # Check that the response has the expected structure
            #if 'total_games' in data and 'total_wins' in data:
             #   return data

            #return None

        except requests.exceptions.RequestException as e:
            print(f"An error occurred while fetching game statistics: {e}")
            return None
    
    @staticmethod
    def calculate_starting_odds(game_statistics, fight_id):
        if game_statistics is None:
            return None
        fight = Fight.query.get(fight_id)
        # Assuming the game statistics include number of wins
        number_of_games = game_statistics['totalGames']
        number_of_wins_fighter1 = game_statistics['totalWinsFighter1']

        if number_of_games == 0:
            return None

        # Win percentage based on past games
        win_percentage = round(number_of_wins_fighter1 / number_of_games,2)
        
        # Calculate odds
        odd_fighter1 = round(1 / win_percentage,1)
        odd_fighter2 =round( 1/ (1 - win_percentage),1)

        # Add a 4% layer for the website's long-term winnings
        odd_fighter1_with_layer = round(odd_fighter1 * 1.04, 1)
        odd_fighter2_with_layer = round(odd_fighter2 * 1.04, 1)
        odds_with_layer = { 'odd1': odd_fighter1_with_layer, 'odd2': odd_fighter2_with_layer }
        fight.odd1 = odd_fighter1_with_layer
        fight.odd2 = odd_fighter2_with_layer
        db.session.commit()
        
        return odds_with_layer

    @staticmethod
    def calculate_odds(fight_id, selected_fighter):
        # Get the specific fight
        fight = Fight.query.get(fight_id)
        if not fight:
            print(f"No fight found for id {fight_id}")
            return None

        print(f"Calculating odds for fight id {fight_id}")

        # Calculate initial odds based on game statistics
        odd_fighter1 = fight.odd1
        odd_fighter2 = fight.odd2
        total_bet_fighter1 = fight.betting_pool1
        total_bet_fighter2 = fight.betting_pool2

        print(f"Initial odds: Fighter1 = {odd_fighter1}, Fighter2 = {odd_fighter2}")
        print(f"Total bets: Fighter1 = {total_bet_fighter1}, Fighter2 = {total_bet_fighter2}")

        total_bet = total_bet_fighter1 + total_bet_fighter2
        print(f"Total bet: {total_bet}")

        # Adjust the odds based on the amounts bet and the selected fighter
        if selected_fighter == fight.fighter1_nft_address:
            odd_fighter1 = round(odd_fighter1 * (1 - total_bet_fighter1 / (total_bet+1)), 1)
            odd_fighter2 = round(odd_fighter2 * (1 + total_bet_fighter2 / (total_bet+1)), 1)
        if selected_fighter == fight.fighter2_nft_address:
            odd_fighter1 = round(odd_fighter1 * (1 + total_bet_fighter1 / (total_bet+1)), 1)
            odd_fighter2 = round(odd_fighter2 * (1 - total_bet_fighter2 / (total_bet+1)), 1)
            
        print(f"Adjusted odds: Fighter1 = {odd_fighter1}, Fighter2 = {odd_fighter2}")

        # Update odds in Fight model and commit changes to the database
        fight.odd1 = odd_fighter1
        fight.odd2 = odd_fighter2
        db.session.commit()

        print(f"Odds updated in database: Fighter1 = {fight.odd1}, Fighter2 = {fight.odd2}")
        return {'odd1': fight.odd1, 'odd2': fight.odd2}
