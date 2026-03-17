#!/bin/bash
# ==============================================================================
# Parallel Poker Game Testing with 50 Agents
# ==============================================================================

SESSION="poker-tests"
TOTAL_AGENTS=50
LOG_DIR="./tests/parallel/logs"

# Clean up any existing session
tmux has-session -t $SESSION 2>/dev/null
if [ $? -eq 0 ]; then
    tmux kill-session -t $SESSION
fi

# Create log directory
mkdir -p "$LOG_DIR"
rm -f "$LOG_DIR"/*.log

# Create new session
tmux new-session -d -s $SESSION -n "coordinator"

# Split window for coordinator stats
tmux split-window -h -t $SESSION:0

# Test scenarios with different parameters
SCENARIOS=(
    "--aiOnly --playerCount 2 --startingChips 1000 --smallBlind 10 --bigBlind 20"
    "--aiOnly --playerCount 3 --startingChips 1000 --smallBlind 10 --bigBlind 20"
    "--aiOnly --playerCount 4 --startingChips 1000 --smallBlind 10 --bigBlind 20"
    "--aiOnly --playerCount 6 --startingChips 1000 --smallBlind 10 --bigBlind 20"
    "--aiOnly --playerCount 2 --startingChips 500 --smallBlind 5 --bigBlind 10"
    "--aiOnly --playerCount 4 --startingChips 500 --smallBlind 5 --bigBlind 10"
    "--aiOnly --playerCount 2 --startingChips 2000 --smallBlind 20 --bigBlind 40"
    "--aiOnly --playerCount 4 --startingChips 2000 --smallBlind 20 --bigBlind 40"
)

# AI difficulties
DIFFICULTIES=("easy" "normal" "hard" "maniac")

echo "Starting $TOTAL_AGENTS parallel test agents..."
echo "Logs will be written to $LOG_DIR"

# Function to run test agent
run_agent() {
    local agent_id=$1
    local window_name="agent-$agent_id"
    local scenario_idx=$((agent_id % ${#SCENARIOS[@]}))
    local difficulty=${DIFFICULTIES[$((agent_id % ${#DIFFICULTIES[@]}))]}
    local scenario="${SCENARIOS[$scenario_idx]}"
    local hands=$(((agent_id % 5) * 20 + 20)) # 20, 40, 60, 80, 100 hands
    local log_file="$LOG_DIR/agent-$agent_id.log"

    # Create new window for this agent
    tmux new-window -t $SESSION -n $window_name

    # Run the test command
    tmux send-keys -t $SESSION:$window_name \
        "npm run test:scenario -- $scenario --difficulty $difficulty --hands $hands 2>&1 | tee '$log_file'" C-m

    # Set window status to indicate running
    tmux set-window-option -t $SESSION:$window_name window-status-format "#[fg=yellow]▶ $window_name"
}

# Launch all agents
for i in $(seq 0 $((TOTAL_AGENTS - 1))); do
    run_agent $i
    # Small delay to avoid overwhelming the system
    sleep 0.1
done

# Coordinator window - shows overall progress
tmux select-window -t $SESSION:0
tmux send-keys -t $SESSION:0.0 "clear" C-m
tmux send-keys -t $SESSION:0.0 "echo '=== Poker Game Parallel Test Coordinator ==='" C-m
tmux send-keys -t $SESSION:0.0 "echo \"Total Agents: $TOTAL_AGENTS\"" C-m
tmux send-keys -t $SESSION:0.0 "echo \"Log Directory: $LOG_DIR\"" C-m
tmux send-keys -t $SESSION:0.0 "echo ''" C-m
tmux send-keys -t $SESSION:0.0 "watch -n 2 'echo \"Active Tests: \$(tmux list-windows -t $SESSION | wc -l)\"; echo \"Completed: \$(ls $LOG_DIR/*.log 2>/dev/null | wc -l)\"; echo \"Failed: \$(grep -l \"Error\\|FAIL\" $LOG_DIR/*.log 2>/dev/null | wc -l)\"'" C-m

# Summary window -实时显示结果
tmux send-keys -t $SESSION:0.1 "clear" C-m
tmux send-keys -t $SESSION:0.1 "echo '=== Test Results Summary ==='" C-m
tmux send-keys -t $SESSION:0.1 "tail -f $LOG_DIR/*.log" C-m

echo ""
echo "✓ Launched $TOTAL_AGENTS parallel test agents in tmux session: $SESSION"
echo ""
echo "Commands:"
echo "  tmux attach -t $SESSION  - Attach to session"
echo "  tmux list-windows -t $SESSION  - List all windows"
echo "  tmux kill-session -t $SESSION  - Kill session"
echo ""
echo "Agent windows: agent-0 through agent-$((TOTAL_AGENTS - 1))"
