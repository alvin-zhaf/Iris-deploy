import os
import json
from openai import OpenAI
from typing import Dict, List, Tuple, Optional
from dotenv import load_dotenv
load_dotenv()

# 1. Define a class to hold information about each service.
class Service:
    def __init__(self, name: str, service_description: str):
        self.name = name
        self.service_description = service_description

# 2. Create a list of Service instances with descriptions that serve both for routing and processing
services = [
    Service(
        name="WeatherOracle",
        service_description=(
            "Retrieves weather data for smart contracts that need weather information. "
            "Provides weather-related information that impacts user scenarios, including "
            "how weather conditions might affect financial decisions, outdoor activities, "
            "or other weather-dependent situations."
        )
    ),
    Service(
        name="MarketAnalyzer",
        service_description=(
            "Analyzes cryptocurrency market data and provides insights. "
            "Offers market analysis related to cryptocurrencies or financial markets, "
            "focusing on trends, potential impacts, and analytical perspectives "
            "that would help inform financial decisions."
        )
    ),
    Service(
        name="TransactionValidator",
        service_description=(
            "Verifies external transactions and confirms their validity on-chain. "
            "Provides information about transaction validation, verification processes, "
            "and blockchain confirmation mechanisms, explaining how validity is determined "
            "and what factors affect transaction processing."
        )
    ),
    Service(
        name="DataRetriever",
        service_description=(
            "Fetches external data from APIs and returns it to the blockchain. "
            "Focuses on how external data could be fetched, integrated, and utilized "
            "within a blockchain environment, explaining relevant APIs, data structures, "
            "and how information can be returned to the blockchain in a useful format."
        )
    )
]

# Create a service lookup dictionary for easy access
service_map = {service.name: service for service in services}

# 3. Build the function tools dynamically from the Service class.
def build_function_tools(services_list):
    tools = []
    for service in services_list:
        tool = {
            "type": "function",
            "function": {
                "name": service.name,
                "description": service.service_description,
                "parameters": {
                    "type": "object",
                    "properties": {
                        "input": {
                            "type": "string",
                            "description": f"A text description detailing anything that could relate to {service.name}."
                        }
                    },
                    "required": ["input"]
                }
            }
        }
        tools.append(tool)
    return tools

# 4. Define a function that determines the next service to route to
def select_next_service(input_description: str, current_service: str, 
                        previous_response: str, api_key: str, model: str = "gpt-4o") -> str:
    client = OpenAI(api_key=api_key)
    function_tools = build_function_tools(services)
    
    system_prompt = (
        "You are a routing system for a multi-agent blockchain service network. "
        "You need to determine which service should process the input next based on the query, "
        "the current service, and its response. Choose one of: WeatherOracle, MarketAnalyzer, "
        "TransactionValidator, or DataRetriever. "
        "Select the service that would be most helpful for the next step in processing this request."
    )
    
    user_message = (
        f"Current query: {input_description}\n\n"
        f"Current service: {current_service}\n\n"
        f"Current service response: {previous_response}\n\n"
        "Which service should handle this next? Choose the most appropriate one."
    )
    
    response = client.chat.completions.create(
        model=model,
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_message}
        ],
        tools=function_tools,
        tool_choice="auto"
    )
    
    # Extract the selected service from the response
    if response.choices[0].message.tool_calls:
        return response.choices[0].message.tool_calls[0].function.name
    
    # Fallback to DataRetriever if no clear selection
    return "DataRetriever"

# 5. Define a function to process input with the current service
def process_with_service(input_description: str, service_name: str, api_key: str, model: str = "gpt-4o") -> str:
    client = OpenAI(api_key=api_key)
    
    if service_name not in service_map:
        return f"Error: Service '{service_name}' not found."
    
    service = service_map[service_name]
    
    # Use the service description as the processing prompt
    system_prompt = (
        f"You are the {service.name} service. {service.service_description} "
        f"Given the following input, provide information according to your service description."
    )
    
    response = client.chat.completions.create(
        model=model,
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": input_description}
        ]
    )
    
    return response.choices[0].message.content

# 6. Define a function to determine if the current answer should be final
def is_answer_final(input_description: str, current_response: str, 
                   service_path: List[str], api_key: str, model: str = "gpt-4o") -> Tuple[bool, str]:
    client = OpenAI(api_key=api_key)
    
    system_prompt = (
        "You are a quality control system for a multi-agent service network. "
        "Your job is to determine if the current response adequately answers the original query "
        "or if more processing is needed from other services. "
        "If the answer is sufficient, respond with 'FINAL: [reason]'. "
        "If more processing is needed, respond with 'CONTINUE: [reason]'."
    )
    
    services_used = ", ".join(service_path)
    
    user_message = (
        f"Original query: {input_description}\n\n"
        f"Current response: {current_response}\n\n"
        f"Services used so far: {services_used}\n\n"
        "Is this response sufficient to be the final answer, or should we continue processing "
        "with another service? Consider completeness, relevance, and whether additional "
        "perspectives would significantly improve the answer."
    )
    
    response = client.chat.completions.create(
        model=model,
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_message}
        ]
    )
    
    decision_text = response.choices[0].message.content
    
    if decision_text.startswith("FINAL:"):
        return True, decision_text[6:].strip()
    else:
        return False, decision_text[9:].strip() if decision_text.startswith("CONTINUE:") else decision_text

# 7. Define function to create concise summary of the final answer
def create_concise_summary(input_description: str, final_response: str, api_key: str, model: str = "gpt-4o") -> str:
    client = OpenAI(api_key=api_key)
    
    system_prompt = (
        "You are a summarization service that creates extremely concise summaries. "
        "Given the original query and a detailed response, create a very concise summary "
        "that captures only the most essential information in 3-5 bullet points. "
        "Be direct and to the point, avoiding unnecessary explanations."
    )
    
    user_message = (
        f"Original query: {input_description}\n\n"
        f"Detailed response: {final_response}\n\n"
        "Create an extremely concise summary with just the most essential points."
    )
    
    response = client.chat.completions.create(
        model=model,
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_message}
        ]
    )
    
    return response.choices[0].message.content

# 8. Main function to run the multi-agent system
def run_multi_agent_system(input_description: str, api_key: str, model: str = "gpt-4o",
                          max_iterations: int = 5, initial_service: str = "TransactionValidator") -> Dict:
    # Track the path through services and responses
    service_path = []
    responses = []
    reasons = []
    
    # Print header
    print(f"\n{'='*50}")
    print(f"ORIGINAL QUERY: {input_description}")
    print(f"{'='*50}")
    print("\nPROCESSING IN REAL-TIME:")
    
    # Validate the initial service
    if initial_service not in service_map:
        print(f"Warning: Specified initial service '{initial_service}' not found. Defaulting to TransactionValidator.")
        initial_service = "TransactionValidator"
    
    # Set the initial service as specified
    current_service = initial_service
    service_path.append(current_service)
    
    # Process through services
    current_response = ""
    iteration = 0
    final_reason = ""
    
    while iteration < max_iterations:
        iteration += 1
        
        # Print current step
        print(f"\n--- Step {iteration}: {current_service} ---")
        
        # Process with current service
        print("Processing...")
        current_response = process_with_service(input_description, current_service, api_key, model)
        responses.append(current_response)
        
        # Print a preview of the response
        print(f"Response: {current_response[:150]}...")
        
        # Check if this should be our final answer
        print("Evaluating response quality...")
        is_final, reason = is_answer_final(input_description, current_response, service_path, api_key, model)
        reasons.append(reason)
        
        # Print the reasoning
        print(f"Reasoning: {reason}")
        
        if is_final:
            final_reason = reason
            print("\nFinal answer reached!")
            break
        
        # Determine next service
        print("Selecting next service...")
        next_service = select_next_service(input_description, current_service, current_response, api_key, model)
        print(f"Selected next service: {next_service}")
        
        # If we're going in circles, stop
        if next_service in service_path and len(service_path) > 1:
            final_reason = "Terminating due to service loop detection."
            print(f"\nTerminating: {final_reason}")
            break
        
        current_service = next_service
        service_path.append(current_service)
    
    # Create concise summary
    print("\nCreating concise summary...")
    concise_summary = create_concise_summary(input_description, current_response, api_key, model)
    
    # Compile results
    result = {
        "original_query": input_description,
        "service_path": service_path,
        "responses": responses,
        "reasons": reasons,
        "final_answer": current_response,
        "concise_summary": concise_summary,
        "final_reason": final_reason,
        "is_complete": iteration < max_iterations
    }
    
    # Print final output
    print(f"\n{'='*50}")
    print("CONCISE SUMMARY:")
    print(f"{concise_summary}")
    print(f"\nFinal determination: {final_reason}")
    print(f"{'='*50}")
    
    return result

# Run system if executed directly
if __name__ == "__main__":
    api_key = os.getenv("OPENAI_API_KEY")
    
    # Example query
    input_description = "I want it to have a weather oracle that can provide me with the weather forecast for the next week in New York City, And find the best Finantial market that I would have for that day."
    
    # Run the multi-agent system with TransactionValidator as the first service
    result = run_multi_agent_system(
        input_description=input_description, 
        api_key=api_key,
        initial_service="TransactionValidator"
    )