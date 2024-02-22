#pragma once

#include "zeno.h"

namespace ZENO {
	std::string INT(ZenoType value) {
		return std::to_string(std::get<int>(value));
	}
}
