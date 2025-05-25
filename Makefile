run-all:
	@echo "Starting all Node apps..."
	@cd auth-service && npm run dev &	
	@cd backend && npm start &	
	@cd frontend && npm start &	
	@wait