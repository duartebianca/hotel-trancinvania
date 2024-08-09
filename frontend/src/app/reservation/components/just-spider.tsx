import {Image} from "@chakra-ui/react";
import Spider from "../../../shared/assets/spider.png";
export const JustSpider: React.FC = () => {
    return (      
      <Image
      src={Spider}
      alt="Top Right"
      position="absolute"
      top="0px" 
      right="0"
      zIndex="0"
      display={{ base: "none", md: "block" }} 
      transform="scale(0.8)" 
      transformOrigin="top right" 
    /> 
);
};

