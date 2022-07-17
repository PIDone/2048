#include <cmath>
#include <iostream>
#include <vector>

#include "board.h"
#include "shifting.h"

std::vector<int> shifting::getLegalShifts() {
	std::vector<int> legalMoves;
	
	for (int i = 0; i < board::size; i++) {
		int done = false;
		int foundTile = false;
		int previous = 0;
		for (int j = board::size - 1; j >= 0; j--) {
			int current = board::board[j][i].exponent;
			if (current > 0)
				foundTile = true;
			
			if (foundTile) {
				if (current == 0 || current == previous) {
					legalMoves.push_back(0);
					done = true;
					break;
				}
				previous = current;
			}
		}

		if (done)
			break;
	}
	for (int i = 0; i < board::size; i++) {
		int done = false;
		int foundTile = false;
		int previous = 0;
		for (int j = board::size - 1; j >= 0; j--) {
			int current = board::board[i][j].exponent;
			if (current > 0)
				foundTile = true;
			
			if (foundTile) {
				if (current == 0 || current == previous) {
					legalMoves.push_back(1);
					done = true;
					break;
				}
				previous = current;
			}
		}

		if (done)
			break;
	}
	for (int i = 0; i < board::size; i++) {
		int done = false;
		int foundTile = false;
		int previous = 0;
		for (int j = 0; j < board::size; j++) {
			int current = board::board[j][i].exponent;
			if (current > 0)
				foundTile = true;
			
			if (foundTile) {
				if (current == 0 || current == previous) {
					legalMoves.push_back(2);
					done = true;
					break;
				}
				previous = current;
			}
		}

		if (done)
			break;
	}
	for (int i = 0; i < board::size; i++) {
		int done = false;
		int foundTile = false;
		int previous = 0;
		for (int j = 0; j < board::size; j++) {
			int current = board::board[i][j].exponent;
			if (current > 0)
				foundTile = true;
			
			if (foundTile) {
				if (current == 0 || current == previous) {
					legalMoves.push_back(3);
					done = true;
					break;
				}
				previous = current;
			}
		}

		if (done)
			break;
	}

	return legalMoves;
}

void shifting::shiftUp() {
	bool success = false;
	std::vector<std::pair<int, int>> merged;
	for (int i = 1; i < board::size; i++) {
		for (int j = 0; j < board::size; j++) {
			if (board::board[i][j].exponent == 0)
				continue;

			int maxSquare = i;
			for (int k = i - 1; k >= 0; k--) {
				if (board::board[k][j].exponent > 0)
					break;
				maxSquare = k;
			}

			if (maxSquare > 0 && board::board[maxSquare - 1][j].exponent == board::board[i][j].exponent) {
				if (!board::board[maxSquare-1][j].moved) {
					shifting::merge({ maxSquare - 1, j }, { i, j });
					merged.push_back({ maxSquare-1, j });
					success = true;
					continue;
				}
			}
			if (maxSquare == i)
				continue;

			success = true;
			board::board[maxSquare][j] = { board::board[i][j].exponent, false };
			board::board[i][j] = { 0, false };
		}
	}

	for (int i = 0; i < merged.size(); i++) {
		std::pair<int, int> coord = merged[i];
		board::board[coord.first][coord.second].moved = false;
	}

	if (success)
		board::newTile();
}
void shifting::shiftLeft() {
	int success = false;
	std::vector<std::pair<int, int>> merged;
	for (int i = 0; i < board::size; i++) {
		for (int j = 0; j < board::size; j++) {
			if (board::board[i][j].exponent == 0)
				continue;

			int maxSquare = j;
			for (int k = j - 1; k >= 0; k--) {
				if (board::board[i][k].exponent > 0)
					break;
				maxSquare = k;
			}

			if (maxSquare > 0 && board::board[i][maxSquare-1].exponent == board::board[i][j].exponent) {
				if (!board::board[i][maxSquare-1].moved) {
					merge({ i, maxSquare-1 }, { i, j });
					merged.push_back({ i, maxSquare-1 });
					success = true;
					continue;
				}
			}
			if (maxSquare == j)
				continue;

			success = true;
			board::board[i][maxSquare] = { board::board[i][j].exponent, false };
			board::board[i][j] = { 0, false };
		}
	}

	for (int i = 0; i < merged.size(); i++) {
		std::pair<int, int> coord = merged[i];
		board::board[coord.first][coord.second].moved = false;
	}

	if (success)
		board::newTile();
}
void shifting::shiftDown() {
	int success = false;
	std::vector<std::pair<int, int>> merged;
	for (int i = board::size - 1; i >= 0; i--) {
		for (int j = 0; j < board::size; j++) {
			if (board::board[i][j].exponent == 0)
				continue;

			int maxSquare = i;
			for (int k = i + 1; k < board::size; k++) {
				if (board::board[k][j].exponent > 0)
					break;
				maxSquare = k;
			}

			if (maxSquare < board::size - 1 && board::board[maxSquare+1][j].exponent == board::board[i][j].exponent) {
				if (!board::board[maxSquare+1][j].moved) {
					merge({ maxSquare+1, j }, { i, j });
					merged.push_back({ maxSquare+1, j });
					success = true;
					continue;
				}
			}
			if (maxSquare == i)
				continue;

			success = true;
			board::board[maxSquare][j] = { board::board[i][j].exponent, false };
			board::board[i][j] = { 0, false };
		}
	}

	for (int i = 0; i < merged.size(); i++) {
		std::pair<int, int> coord = merged[i];
		board::board[coord.first][coord.second].moved = false;
	}

	if (success)
		board::newTile();
}
void shifting::shiftRight() {
	int success = false;
	std::vector<std::pair<int, int>> merged;
	for (int i = 0; i < board::size; i++) {
		for (int j = board::size - 1; j >= 0; j--) {
			if (board::board[i][j].exponent == 0)
				continue;

			int maxSquare = j;
			for (int k = j + 1; k < board::size; k++) {
				if (board::board[i][k].exponent > 0)
					break;
				maxSquare = k;
			}

			if (maxSquare < board::size - 1 && board::board[i][maxSquare+1].exponent == board::board[i][j].exponent) {
				if (!board::board[i][maxSquare+1].moved) {
					merge({ i, maxSquare+1 }, { i, j });
					merged.push_back({ i, maxSquare+1 });
					success = true;
					continue;
				}
			}
			if (maxSquare == j)
				continue;

			success = true;
			board::board[i][maxSquare] = { board::board[i][j].exponent, false };
			board::board[i][j] = { 0, false };
		}
	}

	for (int i = 0; i < merged.size(); i++) {
		std::pair<int, int> coord = merged[i];
		board::board[coord.first][coord.second].moved = false;
	}

	if (success)
		board::newTile();
}

void shifting::merge(std::pair<int, int> original, std::pair<int, int> added) {
	board::board[original.first][original.second].exponent++;
	board::board[original.first][original.second].moved = true;
	board::board[added.first][added.second].exponent = 0;

	board::score += (1 << board::board[original.first][original.second].exponent);
}

std::string shifting::shift(int dir) {
	switch (dir) {
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
	return board::encode();
}