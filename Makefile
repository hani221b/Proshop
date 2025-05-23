run-all:
	@echo "Starting all Node apps..."
	@cd auth-service && npm start &	
	@cd backend && npm start &	
	@cd frontend && npm start &	
	@wait