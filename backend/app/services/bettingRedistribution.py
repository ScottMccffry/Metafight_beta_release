from app import db
from app.models import Fight, User, Bet, Fighter

#Function to redistribute winnings

def redistribute_winnings(fight_id, winning_fighter_address):

    # 1. Fetch the specific fight from the database
    fight = Fight.query.get(fight_id)
    winning_fighter=Fighter.query.filter_by(nft_address=winning_fighter_address).first()
    # 2. Add up the two betting pools
    total_pool = fight.betting_pool1 + fight.betting_pool2

    # 3. Take away 2% and send it to the owner of the fighter
    fighter_owner_reward = total_pool * 0.02
    total_pool -= fighter_owner_reward
    # Assuming the fighter's owner is a user who has a balance
    fighter_owner = User.query.get(winning_fighter.owner_id)
    fighter_owner.funds += fighter_owner_reward # change funds to balance
    db.session.commit()

    # 4. Fetch the winning bets from the database
    winning_bets = Bet.query.filter_by(fight_id=fight_id, selected_fighter=winning_fighter_address).all()

    # 5. For each winning bet, calculate the winning amount and update the user's balance
    for bet in winning_bets:
        winning_amount = bet.bet_amount * bet.odds
        user = User.query.get(bet.user_id)
        user.funds += winning_amount
        total_pool -= winning_amount
    db.session.commit()
    
    # Verify that the total pool is now empty (or close to it, due to rounding errors)
    assert abs(total_pool) < 1e-6, "There's still money left in the betting pool"

    return True