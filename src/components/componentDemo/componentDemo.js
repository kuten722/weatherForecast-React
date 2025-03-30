import {
    Accordion,
    AccordionItem,
    AccordionItemHeading,
    AccordionItemButton,
    AccordionItemPanel,
  } from "react-accessible-accordion";
  
  function FAQ() {
    return (
      <Accordion>
        <AccordionItem>
          <AccordionItemHeading>
            <AccordionItemButton>
              天气应用如何使用？
            </AccordionItemButton>
          </AccordionItemHeading>
          <AccordionItemPanel>
            <p>
              只需在搜索框中输入城市名称，即可查看当前天气和未来7天预报。
            </p>
          </AccordionItemPanel>
        </AccordionItem>
        
        <AccordionItem>
          <AccordionItemHeading>
            <AccordionItemButton>
              数据来源是什么？
            </AccordionItemButton>
          </AccordionItemHeading>
          <AccordionItemPanel>
            <p>
              我们使用OpenWeatherMap API提供实时天气数据。
            </p>
          </AccordionItemPanel>
        </AccordionItem>
      </Accordion>
    );
  }

export default FAQ