#ifndef ZENO_H
#define ZENO_H

#pragma once

#include <iostream>
#include <functional>
#include <variant>
#include <memory>
#include <optional>

typedef std::variant<int, double, std::string, bool, std::vector<int>> ZenoType;
typedef std::optional<ZenoType> ZenoParent;
typedef std::function<std::string(ZenoType, std::optional<ZenoType>)> ZenoLogger;

namespace ZENO {
	std::string INT(ZenoType value);
}

struct ZenoObject {
	std::unique_ptr<ZenoType> value;
	std::string name;
	ZenoParent parent;
	ZenoLogger logger;
};

class Zeno {
public:
	void setCurrentLine(int line);
	void setCurrentLines(int lines);

	void enroll(std::string name, int* value);
	void enroll(std::string name, double* value);
	void enroll(std::string name, std::string* value);
	void enroll(std::string name, bool* value);
	void enroll(std::string name, std::vector<int>* value);

private:
	std::string instructions;
};

#include "zeno.cpp"

#endif
