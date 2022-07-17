#include <algorithm>
#include <iostream>
#include <vector>

#include "board.h"
#include "search.h"
#include "shifting.h"

int search::evaluate() {
	if (board::gameOver())
		return -1000000000;
	
	int maxTile = 0;
	for (int i = 0; i < board::size; i++)
		for (int j = 0; j < board::size; j++) {
			maxTile = std::max(board::board[i][j].exponent, maxTile);
	}

	int monotonicity = 0;

	int temp1 = 0;
	int temp2 = 0;
	int temp3 = 0;
	int temp4 = 0;
	
	for (int i = 0; i < board::size; i++) {
		int previous = -1;

		int isMonotone1 = true;
		int isMonotone2 = true;

		for (int j = 0; j < board::size; j++) {
			int current = board::board[i][j].exponent;
			if (current == 0) {
				previous = current;
				continue;
			}

			if (current < previous) {
				isMonotone1 = false;
				break;
			}

			previous = current;
		}

		previous = 1000000000;

		for (int j = 0; j < board::size; j++) {
			int current = board::board[i][j].exponent;
			if (current == 0) {
				previous = current;
				continue;
			}

			if (current > previous) {
				isMonotone2 = false;
				break;
			}

			previous = current;
		}

		temp1 += isMonotone1 ? 1 : 0;
		temp2 += isMonotone2 ? 1 : 0;

		previous = -1;

		int isMonotone3 = true;
		int isMonotone4 = true;

		for (int j = 0; j < board::size; j++) {
			int current = board::board[j][i].exponent;
			if (current == 0) {
				previous = current;
				continue;
			}

			if (current < previous) {
				isMonotone3 = false;
				break;
			}

			previous = current;
		}

		previous = 1000000000;

		for (int j = 0; j < board::size; j++) {
			int current = board::board[j][i].exponent;
			if (current == 0) {
				previous = current;
				continue;
			}

			if (current > previous) {
				isMonotone4 = false;
				break;
			}

			previous = current;
		}

		temp3 += isMonotone3 ? 1 : 0;
		temp4 += isMonotone4 ? 1 : 0;
	}

	monotonicity = std::max(temp1, temp2) + std::max(temp3, temp4);

	int eval = board::score;
	eval += maxTile * 3;
	eval += (2 - monotonicity) * board::score * 3;

	return eval;
}

int search::max(int depth, bool first) {
	if (depth == 0)
		return evaluate();

	int copy[board::size][board::size];
	for (int i = 0; i < board::size; i++) {
		for (int j = 0; j < board::size; j++)
			copy[i][j] = board::board[i][j].exponent;
	}

	int best = 0;
	int bestMove = -1;
	int oldScore = board::score;

	std::vector<int> legalMoves = shifting::getLegalShifts();
	for (int i = 0; i < legalMoves.size(); i++) {
		switch (legalMoves[i]) {
			case 0:
				shifting::shiftUp();
				break;
			case 1:
				shifting::shiftLeft();
				break;
			case 2:
				shifting::shiftDown();
				break;
			case 3:
				shifting::shiftRight();
				break;
		}

		int result = search::max(depth - 1, false);
		if (result > best) {
			best = result;
			bestMove = legalMoves[i];
		}
		
		for (int i = 0; i < board::size; i++) {
			for (int j = 0; j < board::size; j++)
				board::board[i][j].exponent = copy[i][j];
		}
		board::score = oldScore;
	}

	return first ? bestMove : best;
}

int search::search(int timeMS) {
	int total = 0;
	for (int i = 0; i < timeMS; i++)
		total += i;
	return total;
}
