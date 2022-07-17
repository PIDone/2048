#ifndef SHIFTING_H
#define SHIFTING_H

#include <vector>

namespace shifting {
	std::vector<int> getLegalShifts();
	void shiftUp();
	void shiftLeft();
	void shiftDown();
	void shiftRight();
	void merge(std::pair<int, int> original, std::pair<int, int> added);
	std::string shift(int dir);
}

#endif
